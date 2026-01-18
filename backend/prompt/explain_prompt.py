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
    # --- 1. INTERNAL HELPER: Safe Parsing ---
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

    def safe_float(val, default=0.0):
        try: return float(val)
        except: return default

    # --- 2. EXTRACT & SANITIZE CONTEXT ---
    state_id = raw_input.get('state', -2)
    state_name = STATE_MAP.get(int(state_id), "Malaysia")
    
    species_id = raw_input.get('species', -2)
    species_name = SPECIES_MAP.get(int(species_id), "Fish")

    # --- 3. WEATHER EXTRACTION ---
    wind_spd = safe_float(raw_input.get('wind_speed'), 0)
    pressure_val = safe_float(raw_input.get('pressure'), 1010)
    
    # GUARDRAIL: Safety Kill Switch
    is_storm = False
    safety_override_msg = ""
    
    if wind_spd > 40: # ~22 knots
        is_storm = True
        safety_override_msg = "WARNING: DANGEROUS WIND DETECTED."
    elif pressure_val < 996: 
        is_storm = True
        safety_override_msg = "WARNING: STORM PRESSURE DETECTED."

    # Simple Weather Summary
    weather_summary = (
        f"Wind: {raw_input.get('wind_speed', 'N/A')} km/h, "
        f"Temp: {raw_input.get('temperature', 'N/A')}°C, "
        f"Pressure: {raw_input.get('pressure', 'N/A')} hPa"
    )

    # --- 4. VERDICT LOGIC ---
    pred_val = safe_float(prediction, 0.0)

    if is_storm:
        verdict_status = "NO GO (Storm)"
    elif pred_val < 0.5:
        verdict_status = "LOW CATCH"
    elif pred_val < 1.5:
        verdict_status = "AVERAGE CATCH"
    else:
        verdict_status = "HIGH CATCH"

    # --- 5. DRIVER PROCESSING ---
    pos_factors = []
    neg_factors = []
    sorted_drivers = sorted(drivers, key=lambda x: abs(x.get('shap_impact', 0)), reverse=True)

    for driver in sorted_drivers:
        feat_raw = driver.get('feature', driver.get('name', 'Unknown'))
        feature_name = str(feat_raw).replace('_', ' ').title()
        readable_val = get_readable_value(feat_raw, driver.get('model_input_value', 'N/A'))
        shap_val = driver.get('shap_impact', 0)
        
        factor_str = f"{feature_name} ({readable_val})"
        
        if abs(shap_val) > 0.0001: 
            if shap_val > 0: pos_factors.append(factor_str)
            else: neg_factors.append(factor_str)
            
    pos_text = ", ".join(pos_factors[:3]) if pos_factors else "None"
    neg_text = ", ".join(neg_factors[:3]) if neg_factors else "None"

    # --- 6. THE MODIFIED PROMPT ---
    prompt = f"""
You are an expert Captain Advisor. 
Your goal is to explain the forecast to a fisherman in simple, plain language.

--- STRICT RULES ---
1. **Simple Words Only:** Do not use words like "variables", "correlation", "data", or "SHAP". Use words like "Causes", "Good", "Bad", "Strong".
2. **Be Direct:** Keep sentences short and easy to understand. **Under 200 words.**
3. **Safety First:** If Wind > 40km/h, tell them to STAY HOME.
4. **No Guessing:** If you can't find the price on Google, say "Price unknown".

--- TRIP INFO ---
* **Target:** {species_name}
* **Location:** {state_name}
* **Forecast:** {pred_val:.2f} tonnes
* **Verdict:** {verdict_status}
* **Safety Warning:** {safety_override_msg if is_storm else "None"}
* **Weather:** {weather_summary}
* **What Helps (+):** {pos_text}
* **What Hurts (-):** {neg_text}

--- REQUIRED SEARCHES ---
Search Google for:
1. "Wholesale price for {species_name} per kg in {state_name} for the last 3 months" (Current Price)
2. "Amaran angin kencang {state_name} METMalaysia" (Safety)
3. "Harga diesel Malaysia terkini" (Fuel)

--- REPORT TEMPLATE ---

**1. 💰 Is it Worth It? (Money)**
* **Verdict:** {verdict_status}
* **Market Check:** Search for the price of **{species_name}** for the last 3 months.
    * If Price is HIGH + Catch is LOW: "You might make money because the price is high."
    * If Price is LOW + Catch is LOW: "Not worth the fuel cost today."
* **Fuel:** Mention if fuel is expensive right now.

**2. 🔬 Why? (Simple Explanation but in Scientific)**
* Explain simply why the catch is {verdict_status}.
* Talk about the **Weather** ({weather_summary}).
* Mention what is **Helping** ({pos_text}) and what is **Hurting** ({neg_text}).
* *Example:* "The catch is low because the strong wind makes it hard for fish to school."

**3. ⚓ Safety & Tip**
* Check METMalaysia warnings. Is it safe?
* Give one simple tip to fix the "What Hurts" factors.

**4. Captain's Decision**
* One sentence: "GO" or "NO GO" and the main reason.

Write the report now.
    """
    
    return prompt