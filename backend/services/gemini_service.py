from google import genai
from config import GEMINI_API_KEY, LLM_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_reply(prompt: str) -> str:
    """Call Gemini model safely and return generated text."""
    try:
        resp = client.models.generate_content(
            model=LLM_MODEL,
            contents=prompt,
        )
        return resp.text

    except Exception as e:
        print("\n--- GEMINI API ERROR ---")
        print(e)
        print("------------------------\n")
        return f"AI Error: {type(e).__name__}. Check backend logs."
