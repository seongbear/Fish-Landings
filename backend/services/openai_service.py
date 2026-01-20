from openai import OpenAI
from config import OPENAI_API_KEY, LLM_MODEL_OPEN_AI

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_reply(prompt: str) -> str:
    """Call OpenAI model safely and return generated text."""
    try:
        response = client.responses.create(
            model=LLM_MODEL_OPEN_AI,
            input=prompt,
            tools=[
                {
                    "type": "web_search"   # enables web search (similar to Gemini Google Search tool)
                }
            ],
            max_output_tokens=500,
        )

        # Extract text output
        final_text = response.output_text.strip() if response.output_text else "No response generated."

        # Extract citations if web search was used
        sources = []
        for item in response.output:
            if item["type"] == "web_search_call":
                for result in item.get("results", []):
                    if "url" in result:
                        sources.append((result.get("title", "Web Source"), result["url"]))

        # Append sources (deduplicated)
        if sources:
            final_text += "\n\n**Sources:**\n"
            seen = set()
            for i, (title, url) in enumerate(sources, 1):
                if url not in seen:
                    seen.add(url)
                    final_text += f"{i}. {title}\n"

        return final_text

    except Exception as e:
        print("\n--- OPENAI API ERROR ---")
        print(e)
        print("------------------------\n")
        return f"AI Error: {type(e).__name__}. Check backend logs."
