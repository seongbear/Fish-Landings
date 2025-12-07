from flask import Blueprint, request, jsonify
from firebase_admin import db
from config import client, LLM_MODEL
import time

chat_bp = Blueprint("chat_bp", __name__)

def save_msg(user, session, role, text):
    db.reference(f"chats/{user}/{session}").push({
        "role": role,
        "text": text,
        "ts": int(time.time())
    })

def get_history(user, session):
    data = db.reference(f"chats/{user}/{session}").get()
    if not data:
        return []
    return sorted([msg for msg in data.values()], key=lambda x: x["ts"])

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user = data["user_id"]
    session = data["session_id"]
    query = data["query"]

    save_msg(user, session, "user", query)

    history = get_history(user, session)
    context = "\n".join([f"{m['role']}: {m['text']}" for m in history])

    try:
        res = client.models.generate_content(
            model=LLM_MODEL,
            contents=context,
        )
        ai_response = res.text
    except Exception as e:
        ai_response = "AI error: " + str(e)

    save_msg(user, session, "ai", ai_response)
    updated = get_history(user, session)

    return jsonify({"answer": ai_response, "history": updated})
