import os
from dotenv import load_dotenv
from google import genai
import firebase_admin
from firebase_admin import credentials

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in .env")

client = genai.Client(api_key=GEMINI_API_KEY)
LLM_MODEL = "gemini-2.5-flash"

cred = credentials.Certificate("serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://fish-d70e4-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })
