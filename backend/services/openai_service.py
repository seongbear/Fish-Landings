from openai import OpenAI
from config import OPENAI_API_KEY, LLM_MODEL_OPEN_AI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENAI_API_KEY
)

def generate_reply(prompt: str) -> str:
    """
    Call OpenAI chat completion model with reasoning enabled and return the assistant's reply.
    """
    try:
        # First API call with reasoning enabled
        initial_response = client.chat.completions.create(
            model=LLM_MODEL_OPEN_AI,
            messages=[
                {"role": "user", "content": prompt}
            ],
            extra_body={"reasoning": {"enabled": True}},
            max_tokens=500
        )

        # Extract assistant message
        assistant_msg = initial_response.choices[0].message

        # Prepare messages for follow-up (to preserve reasoning if needed)
        messages = [
            {"role": "user", "content": prompt},
            {
                "role": "assistant",
                "content": assistant_msg.content,
                "reasoning_details": getattr(assistant_msg, "reasoning_details", None)
            }
        ]

        # Optional second call to continue reasoning (can skip if single call is enough)
        followup_response = client.chat.completions.create(
            model=LLM_MODEL_OPEN_AI,
            messages=messages,
            extra_body={"reasoning": {"enabled": True}},
            max_tokens=500
        )

        # Extract final text
        final_text = followup_response.choices[0].message.content.strip()

        return final_text if final_text else "No response generated."

    except Exception as e:
        print("\n--- OPENAI API ERROR ---")
        print(e)
        print("------------------------\n")
        return f"AI Error: {type(e).__name__}. Check backend logs."
