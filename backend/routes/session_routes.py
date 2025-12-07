from flask import Blueprint, request, jsonify
import uuid
from firebase_admin import db
import time

session_bp = Blueprint("session_bp", __name__)

@session_bp.route("/session/create", methods=["POST"])
def create_session():
    data = request.get_json()
    user_id = data.get("user_id", "anon")
    title = data.get("title", "New Chat")

    session_id = str(uuid.uuid4())
    
    db.reference(f"chats/{user_id}/{session_id}").push({
        "role": "ai",
        "text": f"{title} started. How can I help?",
        "ts": int(time.time())
    })

    return jsonify({"session_id": session_id})
