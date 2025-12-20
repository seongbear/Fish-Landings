from flask import Blueprint, request, jsonify
import os
import pandas as pd

data_bp = Blueprint("data_bp", __name__)
CSV_FILE_PATH = "data/filtered.csv"

# Get fish landings data with pagination
@data_bp.route("/data/landings", methods=["GET"])
def get_fish_landings():
    if not os.path.exists(CSV_FILE_PATH):
        return jsonify({"error": "Data file not found"}), 404

    try:
        df = pd.read_csv(CSV_FILE_PATH)
        df = df.where(pd.notnull(df), None)  # Replace NaN with None

        # --- Filters from query params ---
        state = request.args.get("state")
        year = request.args.get("year")
        species = request.args.get("species")
        gear = request.args.get("gear")

        # --- Pagination params ---
        page = request.args.get("page", default=1, type=int)
        limit = request.args.get("limit", default=50, type=int)  # default 50 rows per page
        start = (page - 1) * limit
        end = start + limit

        # Apply filters
        if state: df = df[df['state'] == state]
        if year: df = df[df['year'] == int(year)]
        if species: df = df[df['species'] == species]
        if gear: df = df[df['gear_type'] == gear]

        total_count = len(df)

        # Apply pagination
        df_page = df.iloc[start:end]

        raw_data = df_page.to_dict(orient="records")
        return jsonify({
            "status": "success",
            "page": page,
            "limit": limit,
            "total_count": total_count,
            "data": raw_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
