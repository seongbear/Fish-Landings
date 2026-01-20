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


def construct_fisherman_prompt_v2(prediction, drivers, raw_input):
    """Create an OpenAI-compatible explanation prompt for fishermen"""

    # ---------- HELPERS ----------
    def safe_float(val, default=0.0):
        try:
            return float(val)
        except Exception:
            return default

    def get_readable_value(key, value):
        try:
            val_int = int(value)
        except Exception:
            return value

        key_norm = str(key).lower().replace(" ", "_")
        if "species" in key_norm:
            return SPECIES_MAP.get(val_int, f"Species #{val_int}")
        if "state" in key_norm:
            return STATE_MAP.get(val_int, f"State #{val_int}")
        if "gear" in key_norm:
            return GEAR_MAP.get(val_int, f"Gear #{val_int}")
        return value

    # ---------- CONTEXT ----------
    state_id = int(raw_input.get("state", -2)) if str(raw_input.get("state", "")).lstrip("-").isdigit() else -2
    state_name = STATE_MAP.get(state_id, "Malaysia")

    species_id = int(raw_input.get("species", -2)) if str(raw_input.get("species", "")).lstrip("-").isdigit() else -2
    species_name = SPECIES_MAP.get(species_id, "Fish")

    month_num = safe_float(raw_input.get("month"), 0)
    year = raw_input.get("year", 2026)

    month_names = [
        "Unknown", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    month_name = month_names[int(month_num)] if 1 <= int(month_num) <= 12 else "Current Month"

    # ---------- MONSOON LOGIC ----------
    east_coast_ids = [2, 6, 13, 14]
    monsoon_months = [11, 12, 1, 2, 3]

    season_context = "Inter-Monsoon (Variable Weather)"
    is_monsoon_danger = False

    if int(month_num) in monsoon_months:
        season_context = "Northeast Monsoon (Musim Tengkujuh)"
        if state_id in east_coast_ids:
            is_monsoon_danger = True
            season_context += " - HIGH RISK (East Coast)"
    elif int(month_num) in [5, 6, 7, 8, 9]:
        season_context = "Southwest Monsoon"

    # ---------- WEATHER ----------
    wind_speed = safe_float(raw_input.get("wind_speed"), 0)
    pressure = safe_float(raw_input.get("pressure"), 1010)

    is_storm = False
    safety_warning = "None"

    if wind_speed > 40:
        is_storm = True
        safety_warning = "DANGEROUS wind above 40 km/h."
    elif pressure < 996:
        is_storm = True
        safety_warning = "STORM pressure detected."
    elif is_monsoon_danger:
        safety_warning = "Monsoon season. Big waves likely."

    weather_summary = (
        f"Wind {raw_input.get('wind_speed', 'N/A')} km/h, "
        f"Temp {raw_input.get('temperature', 'N/A')}°C, "
        f"Pressure {raw_input.get('pressure', 'N/A')} hPa"
    )

    # ---------- VERDICT ----------
    pred_val = safe_float(prediction, 0)

    if is_storm:
        verdict = "NO GO"
    elif is_monsoon_danger and pred_val < 1.0:
        verdict = "NO GO"
    elif pred_val < 0.5:
        verdict = "LOW CATCH"
    elif pred_val < 1.5:
        verdict = "AVERAGE CATCH"
    else:
        verdict = "HIGH CATCH"

    # ---------- DRIVERS ----------
    pos, neg = [], []
    sorted_drivers = sorted(drivers, key=lambda x: abs(x.get("shap_impact", 0)), reverse=True)

    for d in sorted_drivers:
        name = str(d.get("feature", "Unknown")).replace("_", " ").title()
        val = get_readable_value(d.get("feature"), d.get("model_input_value", "N/A"))
        impact = d.get("shap_impact", 0)

        text = f"{name} ({val})"
        if abs(impact) > 0.0001:
            (pos if impact > 0 else neg).append(text)

    pos_text = ", ".join(pos[:3]) if pos else "None"
    neg_text = ", ".join(neg[:3]) if neg else "None"

    # ---------- FINAL OPENAI PROMPT ----------
    prompt = f"""
You are a **Captain Advisor for Malaysian fishermen**.

Your job is to explain the fishing forecast using **very simple words**.

RULES:
- Short sentences only.
- No technical terms.
- Maximum 200 words.
- Safety is the top priority.
- Use web search when needed.
- If information is not found, say "Unknown".

TRIP DETAILS:
Target Fish: {species_name}
Location: {state_name}
Season: {season_context}
Forecast Catch: {pred_val:.2f} tonnes
Verdict: {verdict}
Safety Warning: {safety_warning}
Weather: {weather_summary}
Helps Catch: {pos_text}
Hurts Catch: {neg_text}

USE WEB SEARCH TO CHECK:
1. Fish price per kg in {state_name}, Malaysia, in {month_name} commonly
2. Latest METMalaysia weather warning for {state_name}
3. Current diesel fuel price in Malaysia

WRITE THE REPORT IN THIS FORMAT:

1. 💰 Money
- Is it worth going?
- Say the fish price or say "Price unknown".
- Compare price with fuel cost.

2. 🌦️ Why This Forecast
- Explain the catch level.
- Talk about wind and weather.
- Say what helps and hurts.

3. ⚠️ Safety
- Say if there is any warning.
- If monsoon on East Coast, warn about big waves.

4. ⚓ Final Call
- One clear sentence: GO or NO GO, and why.

Write the report now.
"""

    return prompt
