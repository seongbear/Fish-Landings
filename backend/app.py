from flask import Flask, render_template
from routes.session_routes import session_bp
from routes.chat_routes import chat_bp
from asgiref.wsgi import WsgiToAsgi

flask_app = Flask(__name__)

# Register blueprints
flask_app.register_blueprint(session_bp)
flask_app.register_blueprint(chat_bp)

@flask_app.route("/")
def home():
    return render_template("index.html")

asgi_app = WsgiToAsgi(flask_app)
