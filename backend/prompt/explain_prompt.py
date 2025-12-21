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
    Builds a prompt with decoded values (Strings instead of Integers).
    """
    
    # --- HELPER: Value Decoder ---
    def get_readable_value(key, value):
        # Ensure we are comparing integers
        try:
            val_int = int(value)
        except (ValueError, TypeError):
            return value # Return original if it's already a string or issue

        if key == 'species':
            return SPECIES_MAP.get(val_int, f"Species #{val_int}")
        elif key == 'state':
            return STATE_MAP.get(val_int, f"State #{val_int}")
        elif key == 'gear_type':
            return GEAR_MAP.get(val_int, f"Gear #{val_int}")
        return value # Return original for other fields (Temp, Rainfall, etc.)

    # 1. Format SHAP Drivers (The "Why")
    drivers_text = ""
    for driver in drivers:
        feature_name = driver.get('feature', '').lower() # normalize key
        raw_val = driver.get('value')
        
        # Decode the value if it's a category
        readable_val = get_readable_value(feature_name, raw_val)
        
        impact = "HELPED increase" if driver.get('shap_value', 0) > 0 else "LOWERED"
        drivers_text += (
            f"- {driver.get('feature')}: {readable_val} "
            f"({impact} the catch)\n"
        )

    # 2. Format Raw Inputs (The "Context")
    context_text = ""
    for key, value in raw_input.items():
        if key not in ['id', 'created_at']: 
            # Decode the value here too
            readable_val = get_readable_value(key, value)
            
            formatted_key = key.replace('_', ' ').title()
            context_text += f"- {formatted_key}: {readable_val}\n"

    # 3. The Prompt Template (Unchanged)
    prompt = f"""
    You are a helpful fisheries expert assistant for fishermen in Malaysia.
    
    TASK:
    Explain the fish catch forecast below in simple, encouraging language.
    
    DATA:
    ----------------
    **Prediction:** {prediction:.2f} Tonnes
    
    **Context (Conditions):**
    {context_text}
    
    **Key Factors Driving this Result:**
    {drivers_text}
    ----------------

    GUIDELINES:
    1. Start with "Based on the conditions in [State/Location]..."
    2. Explicitly mention the Species and Gear Type if they appear in the Key Factors.
    3. Explain the reasoning simply.
    
    Write the explanation now:
    """
    return prompt