import firebase_admin
from firebase_admin import credentials, db
from config import FIREBASE_DB_URL
import time

cred = credentials.Certificate("serviceAccountKey.json")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": FIREBASE_DB_URL
    })

def save_message(user_id, session_id, role, text):
    db.reference(f"chats/{user_id}/{session_id}").push({
        "role": role,
        "text": text,
        "ts": int(time.time())
    })

def load_history(user_id, session_id):
    data = db.reference(f"chats/{user_id}/{session_id}").get()
    if not data:
        return []
    return sorted([v for v in data.values()], key=lambda x: x['ts'])
