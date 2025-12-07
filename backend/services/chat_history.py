import uuid
from services.firebase_service import save_message, load_history

def create_session(user_id, title="New Chat"):
    sid = str(uuid.uuid4())
    save_message(user_id, sid, "ai", f"{title} started. How can I help?")
    return sid

def get_context_prompt(user_id, session_id):
    history = load_history(user_id, session_id)
    return "\n".join([f"{m['role']}: {m['text']}" for m in history])
