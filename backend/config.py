import os
from dotenv import load_dotenv
from google import genai
import firebase_admin
from firebase_admin import credentials

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in .env")

if not DATABASE_URL:
    raise RuntimeError("Missing DATABASE_URL in .env")

client = genai.Client(api_key=GEMINI_API_KEY)
LLM_MODEL = "gemini-3-flash"

cred = credentials.Certificate("serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "databaseURL": DATABASE_URL
    })

OPEN_AI_API_KEY = os.getenv("OPENAI_API_KEY")
LLM_MODEL_OPEN_AI = "openai/gpt-oss-120b:free"