from flask import Blueprint, request, jsonify
from firebase_admin import db
from prompt.llm_prompt import LLM_PROMPT
from config import client, LLM_MODEL
from google.genai import types
import time


chat_bp = Blueprint("chat_bp", __name__)

# --- Helper Functions ---
def save_msg(user_id: str, session_id: str, role: str, text: str):
    db.reference(f"chats/{user_id}/{session_id}/messages").push({
        "role": role,
        "text": text,
        "ts": int(time.time())
    })

def get_history(user_id: str, session_id: str):
    data = db.reference(f"chats/{user_id}/{session_id}/messages").get()
    if not data:
        return []
    return sorted([msg for msg in data.values()], key=lambda x: x["ts"])


# --- Routes ---
@chat_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json() or {}
        user = data.get("user_id")
        session_id = data.get("session_id")
        query = data.get("query")
        print("User query:", query)

        if not user or not session_id or not query:
            return jsonify({"error": "Missing user_id, session_id, or query"}), 400

        # Save user message
        save_msg(user, session_id, "user", query)

        # Build context from full chat history
        history = get_history(user, session_id)
        
        formatted_history = []
        
        for m in history:
            raw_role = m.get("role", "user").lower()
            text_content = m.get("text", "")

            # Skip empty messages to prevent API errors
            if not text_content.strip():
                continue

            # Map 'ai' -> 'model'
            if raw_role in ["ai", "model", "assistant"]:
                api_role = "model"
            else:
                api_role = "user"

            formatted_history.append({
                "role": api_role,
                "parts": [{"text": text_content}] 
            })

        # Generate AI response
        try:
            res = client.models.generate_content(
                model=LLM_MODEL,
                config=types.GenerateContentConfig(
                    system_instruction=LLM_PROMPT,
                    # thinking_config=types.ThinkingConfig(thinking_budget=4096),
                ),
                contents=formatted_history,
            )
            ai_response = res.text
        except Exception as e:
            ai_response = "AI error: " + str(e)

        # Save AI response
        save_msg(user, session_id, "ai", ai_response)
        print("AI response:", ai_response)

        # Return updated history
        updated_history = get_history(user, session_id)
        return jsonify({"answer": ai_response, "history": updated_history}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_bp.route("/session/history", methods=["POST"])
def session_history():
    try:
        data = request.get_json() or {}
        user = data.get("user_id")
        session_id = data.get("session_id")

        if not user or not session_id:
            return jsonify({"error": "Missing user_id or session_id"}), 400

        raw = db.reference(f"chats/{user}/{session_id}/messages").get() or {}
        history_sorted = sorted(raw.values(), key=lambda x: x["ts"])
        return jsonify({"history": history_sorted}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_bp.route("/session/title", methods=["POST"])
def generate_title():
    try:
        data = request.get_json() or {}
        messages = data.get("messages")

        if not messages or not isinstance(messages, list):
            return jsonify({"title": "New Chat"}), 200

        # Use first message as title (truncate to 20 chars)
        first_msg = messages[0].get("text", "New Chat")
        title = first_msg[:20] + "..." if len(first_msg) > 20 else first_msg

        return jsonify({"title": title}), 200

    except Exception as e:
        return jsonify({"title": "New Chat", "error": str(e)}), 500
