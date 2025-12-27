from flask import Blueprint, request, jsonify
import os
import pandas as pd

data_bp = Blueprint("data_bp", __name__)
CSV_FILE_PATH = "static/data/filtered.csv"

# Get fish landings data with pagination
@data_bp.route("/data/landings", methods=["GET"])
def get_fish_landings():
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({"error": "Data file not found"}), 404

    try:
        # 1. Read the full CSV
        df = pd.read_csv(CSV_FILE_PATH)
        df = df.where(pd.notnull(df), None) # Handle NaNs

        # --- Filters (Keep these so you can still filter if needed) ---
        state = request.args.get("state")
        year = request.args.get("year")
        if state: df = df[df['state'] == state]
        if year: df = df[df['year'] == int(year)]
        
        total_count = len(df)

        # --- LOGIC CHANGE: Check for 'all' flag ---
        # If URL has ?all=true, return EVERYTHING. Otherwise, paginate.
        if request.args.get("all") == "true":
            raw_data = df.to_dict(orient="records")
            page = 1
            limit = total_count
        else:
            # Standard Pagination
            page = request.args.get("page", default=1, type=int)
            limit = request.args.get("limit", default=50, type=int)
            start = (page - 1) * limit
            end = start + limit
            
            df_page = df.iloc[start:end]
            raw_data = df_page.to_dict(orient="records")

        return jsonify({
            "status": "success",
            "page": page,
            "limit": limit,
            "total_count": total_count,
            "data": raw_data
        }), 1000

    except Exception as e:
        return jsonify({"error": str(e)}), 500
