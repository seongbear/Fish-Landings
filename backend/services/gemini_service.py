from google import genai
from google.genai import types
from config import GEMINI_API_KEY, LLM_MODEL

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_reply(prompt: str) -> str:
    """Call Gemini model safely and return generated text."""
    try:
        # Google Search Tool 
        google_search_tool = types.Tool(
            google_search=types.GoogleSearch()
        )
        
        # Generate content with search enabled     
        resp = client.models.generate_content(
            model=LLM_MODEL,
            contents=prompt,
            config={
                "tools": [google_search_tool],
                "response_modalities": ["TEXT"]
            }
        )
        
        # Extract text response 
        final_text = resp.text if resp.text else "No response generated."
        
        # Extract and format citations (Grounding Metadata)
        if (resp.candidates and 
            resp.candidates[0].grounding_metadata and 
            resp.candidates[0].grounding_metadata.grounding_chunks):
            
            chunks = resp.candidates[0].grounding_metadata.grounding_chunks
            
            # Extract unique sources (avoiding duplicates)
            sources = {}
            for chunk in chunks:
                if chunk.web and chunk.web.uri:
                    sources[chunk.web.uri] = chunk.web.title or "Web Source"

            # Append sources to the text if any were found
            if sources:
                final_text += "\n\n**Sources:**\n"
                for i, (uri, title) in enumerate(sources.items(), 1):
                    final_text += f"{i}. [{title}]({uri})\n"

        return final_text

    except Exception as e:
        print("\n--- GEMINI API ERROR ---")
        print(e)
        print("------------------------\n")
        return f"AI Error: {type(e).__name__}. Check backend logs."
