import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template_string
from google import genai 
from asgiref.wsgi import WsgiToAsgi
import firebase_admin
from firebase_admin import credentials, db
import time, uuid

# Load environment variables from .env file
load_dotenv()

# Gemini config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    error_message = (
        "\n\nFATAL CONFIGURATION ERROR: GEMINI_API_KEY environment variable is missing."
        "\nThe application cannot proceed without the API key. Please set it in your environment."
    )
    # Raising an error to immediately stop execution if the key is missing.
    raise RuntimeError(error_message)

LLM_MODEL = "gemini-2.5-flash"
# CRITICAL FIX 3: Initialize the client, explicitly passing the validated API key
client = genai.Client(api_key=GEMINI_API_KEY)

# -------------------------------
# Firebase init
# -------------------------------
# Replace "serviceAccountKey.json" with your actual path if different
cred = credentials.Certificate("serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        # Ensure this is the correct Realtime Database URL
        'databaseURL': "https://fish-d70e4-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

# -------------------------------
# Flask app
# -------------------------------
flask_app = Flask(__name__)

# Root route: serve a simple HTML page
@flask_app.route("/", methods=["GET"])
def index():
    html_content = """
    <!DOCTYPE html>
    <html>
      <head>
        <title>Flask Gemini Chat</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
        <h1>Hello World!</h1>
        <p>The Flask Gemini Chat API is running.</p>
        <p>Use the endpoints <code>/session/create</code> and <code>/chat</code> for API calls.</p>
      </body>
    </html>
    """
    return render_template_string(html_content)

# -------------------------------
# Chat helpers
# -------------------------------
def save_msg(user_id, session_id, role, text):
    """Saves a single message to the Firebase Realtime Database."""
    db.reference(f'chats/{user_id}/{session_id}').push({
        "role": role, "text": text, "ts": int(time.time())
    })

def get_history(user_id, session_id):
    """Retrieves and sorts the chat history for a session."""
    data = db.reference(f'chats/{user_id}/{session_id}').get()
    if data: 
        # Sort by timestamp (ts) to maintain correct order
        return sorted([v for v in data.values()], key=lambda x: x['ts'])
    return []

def create_session(user_id, title="New Chat"):
    """Creates a new unique session ID and sends an initial AI message."""
    sid = str(uuid.uuid4())
    save_msg(user_id, sid, "ai", f"{title} started. How can I help?")
    return sid

# -------------------------------
# Routes
# -------------------------------
@flask_app.route("/session/create", methods=["POST"])
def api_create_session():
    """Endpoint to create a new chat session."""
    data = request.get_json()
    user_id = data.get("user_id", "anon")
    title = data.get("title", "New Chat")
    sid = create_session(user_id, title)
    return jsonify({"session_id": sid})

@flask_app.route("/chat", methods=["POST"])
def api_chat():
    """Endpoint to send a query and get an AI response."""
    data = request.get_json()
    user_id = data.get("user_id", "anon")
    session_id = data.get("session_id")
    query = data.get("query", "")

    if not query or not session_id:
        return jsonify({"error": "Missing query or session_id"}), 400

    # 1. Save user message
    save_msg(user_id, session_id, "user", query)
    
    # 2. Get full history and format as context prompt
    history = get_history(user_id, session_id)
    context_prompt = "\n".join([f"{m['role']}: {m['text']}" for m in history])

    ai_text = ""
    try:
        # 3. Call the Gemini API using the correct client method and parameters
        resp = client.models.generate_content(
            model=LLM_MODEL,
            contents=context_prompt,
        )

        # 4. Extract the response text (will raise an exception if response is blocked)
        ai_text = resp.text
        
        print(f"Gemini API Response: {ai_text}") # Uncomment for debug

    except Exception as e:
        print(f"\n--- FATAL GEMINI API ERROR ---")
        print(f"Exception Type: {type(e).__name__}")
        print(f"Error Details: {e}")
        print(f"-------------------------------\n")
        
        # Return a generic error message to the client
        ai_text = f"Sorry, I encountered an internal error: {type(e).__name__}. Please check the backend console."

    # 5. Save the AI response
    save_msg(user_id, session_id, "ai", ai_text)
    
    # Update history again to include the AI response for the return payload
    updated_history = get_history(user_id, session_id)

    return jsonify({"answer": ai_text, "history": updated_history})

# -------------------------------
# ASGI conversion for uvicorn
# -------------------------------
# This is required if you are serving this application using Uvicorn/ASGI server
app = WsgiToAsgi(flask_app)

if __name__ == "__main__":
    import uvicorn
    # The API key must be set as an environment variable (GEMINI_API_KEY) 
    # outside of this script for it to run successfully.
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=5000,
        reload=True
    )