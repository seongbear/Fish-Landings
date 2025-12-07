from flask import Blueprint, request, jsonify
import uuid
from firebase_admin import db
import time

session_bp = Blueprint("session_bp", __name__)

# Create a new session with a default AI welcome message
@session_bp.route("/session/create", methods=["POST"])
def create_session():
    try:
        data = request.get_json() or {}
        user_id = data.get("user_id", "anon")
        title = data.get("title", "New Chat")

        session_id = str(uuid.uuid4())

        # Create meta info
        meta_ref = db.reference(f"chats/{user_id}/{session_id}/meta")
        meta_ref.set({
            "title": title,
            "createdAt": int(time.time())
        })

        # Push initial AI message
        messages_ref = db.reference(f"chats/{user_id}/{session_id}/messages")
        messages_ref.push({
            "role": "ai",
            "text": "Hi, I am your fishing assistant. How can I help you today?",
            "ts": int(time.time())
        })

        return jsonify({"session_id": session_id, "status": "success"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# List all sessions for a user
@session_bp.route("/session/list", methods=["POST"])
def list_sessions():
    try:
        data = request.get_json() or {}
        user = data.get("user_id")
        if not user:
            return jsonify({"status": "error", "message": "Missing user_id"}), 400

        sessions = db.reference(f"chats/{user}").get() or {}

        session_list = [
            {
                "session_id": sid,
                "title": s.get("meta", {}).get("title", "Untitled"),
                "createdAt": s.get("meta", {}).get("createdAt")
            }
            for sid, s in sessions.items()
        ]

        return jsonify({"status": "success", "sessions": session_list}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Update or generate session title
@session_bp.route("/session/title", methods=["POST"])
def generate_title():
    try:
        data = request.get_json() or {}
        user = data.get("user_id")
        session_id = data.get("session_id")
        title = data.get("title", "New Chat")

        if not user or not session_id:
            return jsonify({"status": "error", "message": "Missing user_id or session_id"}), 400

        meta_ref = db.reference(f"chats/{user}/{session_id}/meta")
        meta_ref.update({
            "title": title,
            "updatedAt": int(time.time())
        })

        return jsonify({"status": "success", "title": title}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
