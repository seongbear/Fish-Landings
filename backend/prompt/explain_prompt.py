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

def construct_fisherman_prompt(prediction, drivers, raw_input):
    # --- INTERNAL HELPER: Value Decoder ---
    def get_readable_value(key, value):
        try:
            val_int = int(value)
        except (ValueError, TypeError):
            return value 
        key_norm = str(key).lower().replace(' ', '_')
        if 'species' in key_norm:
            return SPECIES_MAP.get(val_int, f"Species #{val_int}")
        elif 'state' in key_norm:
            return STATE_MAP.get(val_int, f"State #{val_int}")
        elif 'gear' in key_norm:
            return GEAR_MAP.get(val_int, f"Gear #{val_int}")
        return value 

    # --- 1. GUARDRAIL: Verdict Logic ---
    try:
        pred_val = float(prediction)
    except:
        pred_val = 0.0

    if pred_val < 0.5:
        verdict_status = "LOW CATCH (Challenging)"
        verdict_tone = "Cautionary"
    elif pred_val < 1.5:
        verdict_status = "AVERAGE CATCH (Moderate)"
        verdict_tone = "Neutral"
    else:
        verdict_status = "HIGH CATCH (Favorable)"
        verdict_tone = "Encouraging"

    # --- 2. SEASONAL CONTEXT ---
    month = raw_input.get('month', 0)
    try: month = int(month)
    except: month = 0
        
    if month in [11, 12, 1, 2]:
        season_name = "Northeast Monsoon"
        season_desc = "Rough seas"
    elif month in [5, 6, 7, 8]:
        season_name = "Southwest Monsoon"
        season_desc = "Occasional squalls"
    else:
        season_name = "Inter-Monsoon"
        season_desc = "Variable winds"

    # --- 3. DATA EXTRACTION ---
    wind_speed = raw_input.get('wind_speed', 'Unknown')
    temperature = raw_input.get('temperature', 'Unknown')
    
    # Extract State Name for Search Context
    state_id = raw_input.get('state', -2)
    state_name = STATE_MAP.get(int(state_id), "Malaysia")

    # --- 4. PROCESS DRIVERS ---
    pos_factors = []
    neg_factors = []
    sorted_drivers = sorted(drivers, key=lambda x: abs(x.get('shap_impact', 0)), reverse=True)

    for driver in sorted_drivers:
        feat_raw = driver.get('feature', driver.get('name', 'Unknown'))
        feature_name = str(feat_raw).replace('_', ' ').title()
        raw_val = driver.get('model_input_value', driver.get('value', 'N/A'))
        readable_val = get_readable_value(feat_raw, raw_val)
        shap_val = driver.get('shap_impact', driver.get('shap_value', 0))
        
        factor_str = f"{feature_name}: {readable_val}"
        
        if abs(shap_val) > 0.0001: 
            if shap_val > 0:
                pos_factors.append(factor_str)
            else:
                neg_factors.append(factor_str)
    
    if not pos_factors and not neg_factors and len(sorted_drivers) > 0:
        top = sorted_drivers[0]
        readable = get_readable_value(top.get('feature'), top.get('model_input_value'))
        msg = f"{top.get('feature')} ({readable})"
        if top.get('shap_impact', 0) > 0: pos_factors.append(msg)
        else: neg_factors.append(msg)

    pos_text = ", ".join(pos_factors[:3]) if pos_factors else "None"
    neg_text = ", ".join(neg_factors[:3]) if neg_factors else "None"

    # --- 5. PROMPT WITH "REFERENCES" SECTION ---
    prompt = f"""
You are an expert Fisheries Consultant with access to Google Search.

--- INSTRUCTIONS ---
* **Tone:** Professional and {verdict_tone}.
* **Verdict:** You MUST state the catch is **{verdict_status}**.
* **Length:** Keep it short (under 150 words).
* **Tools:** You MUST use Google Search to verify safety advice if the weather is extreme.

--- TRIP DATA ---
* **Location:** {state_name}
* **Verdict:** {verdict_status}
* **Season:** {season_name} ({season_desc})
* **Weather:** Wind: {wind_speed}, Temp: {temperature}
* **Positive Drivers:** {pos_text}
* **Negative Drivers:** {neg_text}

--- REPORT TEMPLATE ---

**1. Forecast Summary**
State the **Verdict**. Mention the **Season** and the current weather conditions in **{state_name}**.

**2. Detailed Analysis**
Explain *why* the catch is predicted this way using the Positive and Negative drivers listed above.

**3. Captain's Advice**
Give one short, practical tip based on the **Negative Drivers** and **Current Weather**.
* **Search Requirement:** Use Google Search to check if there are any specific marine warnings or relevant fuel price trends in {state_name} that reinforce this advice.
* *Example:* "Since the wind is high ({wind_speed}), avoid open waters. Current advisories for {state_name} also warn of rough seas."

**4. References**
* List the specific URLs of the websites you visited to verify the advice (e.g., METMalaysia, fuel price sites, etc).
* Format: [Source Name](URL)

Write the report now:
    """
    
    return prompt