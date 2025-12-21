from flask import Flask, render_template
from asgiref.wsgi import WsgiToAsgi

# 1. Initialize Flask App FIRST (Standard naming is 'app')
app = Flask(__name__)

# 2. Import Blueprints AFTER initializing 'app'
# This structure prevents "Circular Import" errors if your routes ever need to import 'app'
try:
    from routes.session_routes import session_bp
    from routes.chat_routes import chat_bp
    from routes.data_routes import data_bp
    from routes.forecast_routes import forecast_bp

    # 3. Register Blueprints
    app.register_blueprint(session_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(data_bp)
    app.register_blueprint(forecast_bp)
    
except ImportError as e:
    print(f"⚠️ Warning: Could not import some routes. {e}")

@app.route("/")
def home():
    return render_template("index.html")

# 4. Wrap for ASGI (if using Uvicorn/Daphne)
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    # Run using the standard variable 'app'
    app.run(debug=True, port=5000)