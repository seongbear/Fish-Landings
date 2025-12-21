# --- MAPPING CONSTANTS ---
SPECIES_MAP = {
    1: "Alu-Alu / Kacang-Kacang (Barracuda)",
    2: "Ketam Laut (Sea Crab)",
    3: "Bawal Putih (White Pomfret)",
    4: "Kerisi Bali",
    5: "Biji Nangka",
    6: "Kerisi",
    7: "Kayu / Tongkol / Aya Hitam (Tuna)",
    8: "Bawal Hitam (Black Pomfret)",
    9: "Gelama / Tengkerong",
    10: "Selar",
    11: "Sebelah (Flatfish)",
    12: "Tenggiri (Spanish Mackerel)",
    13: "Selar Kuning",
    14: "Siakap (Barramundi)",
    15: "Yu (Shark)",
    -2: "Unknown Species"
}

STATE_MAP = {
    1: "Kedah", 2: "Kelantan", 3: "Labuan", 4: "Melaka",
    5: "Negeri Sembilan", 6: "Pahang", 7: "Perak", 8: "Perlis",
    9: "Pulau Pinang", 10: "Sabah", 11: "Sarawak", 12: "Selangor",
    13: "Terengganu", 14: "Johor", -2: "Unknown State"
}

GEAR_MAP = {
    1: "Anchovy Purse Seines", 2: "Bag Nets", 3: "Barrier Nets",
    4: "Drift/Gill Nets", 5: "Fish Purse Seines", 6: "Hooks & Lines",
    7: "Lift Nets", 8: "Miscellaneous", 9: "Other Seines",
    10: "Portable Traps", 11: "Push/Scoop Nets", 12: "Shellfish Collection",
    13: "Stationary Traps", 14: "Trawl Nets", -2: "Unknown Gear"
}

# --- HELPER: Prompt Constructor (REQUIRED) ---
def construct_fisherman_prompt(prediction, drivers, raw_input):
    """
    Builds a prompt with decoded values (Strings instead of Integers) and scientific context.
    """
    
    # --- INTERNAL HELPER: Value Decoder ---
    def get_readable_value(key, value):
        # Try to convert to int for lookup, otherwise return as is
        try:
            val_int = int(value)
        except (ValueError, TypeError):
            return value 

        if key == 'species':
            return SPECIES_MAP.get(val_int, f"Species #{val_int}")
        elif key == 'state':
            return STATE_MAP.get(val_int, f"State #{val_int}")
        elif key == 'gear_type':
            return GEAR_MAP.get(val_int, f"Gear #{val_int}")
        return value 

    # 1. Format SHAP Drivers (The "Why")
    drivers_text = ""
    for driver in drivers:
        # Robustly get feature name (handles 'feature' or 'name' keys)
        feat_raw = driver.get('feature', driver.get('name', 'Unknown Factor'))
        feature_name = str(feat_raw).lower() 
        
        raw_val = driver.get('value', 'N/A')
        readable_val = get_readable_value(feature_name, raw_val)
        
        # Determine Impact Direction (Logic: SHAP > 0 = Good for catch)
        shap = driver.get('shap_value', 0)
        if shap > 0:
            impact_desc = "POSITIVE (Increases Catch)"
        elif shap < 0:
            impact_desc = "NEGATIVE (Decreases Catch)"
        else:
            impact_desc = "NEUTRAL"

        drivers_text += (
            f"- Factor: {feat_raw}\n"
            f"  Value: {readable_val}\n"
            f"  Effect: {impact_desc}\n"
        )

    # 2. Format Raw Inputs (The "Context")
    # We filter out 'prediction', 'id', etc. to avoid redundancy in the prompt
    context_text = ""
    excluded_keys = ['id', 'created_at', 'prediction', 'shap_values']
    
    for key, value in raw_input.items():
        if key not in excluded_keys: 
            readable_val = get_readable_value(key, value)
            formatted_key = key.replace('_', ' ').title()
            context_text += f"- {formatted_key}: {readable_val}\n"

    # 3. The Prompt Template
    prompt = f"""
    You are a wise and friendly fisheries scientist assisting fishermen in Malaysia.
    
    YOUR GOAL:
    Explain the forecasted fish catch volume by connecting the environmental data to fish behavior. Use simple scientific reasoning (e.g., how water temperature affects fish hunger, or how wind affects boat stability/water mixing).

    THE FORECAST DATA:
    ----------------
    **Predicted Catch:** {prediction:.5f} Tonnes
    
    **Trip Conditions:**
    {context_text}
    
    **Top Influencing Factors (Why the model predicted this):**
    {drivers_text}
    ----------------

    GUIDELINES:
    1. Keep it under 300 words.
    2. Use simple English.
    3. Start directly with the result (e.g., "Good catch expected..." or "Catch might be low...").
    4. Mention the main reason briefly (e.g., "due to warm water" or "because wind is strong").
    5. Do not use technical terms or complex sentences.

    Write the short summary now:
    """
    return prompt