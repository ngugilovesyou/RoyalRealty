import logging
from logging.handlers import RotatingFileHandler
import os
from flask import Flask, request
from flask_cors import CORS
from flask_migrate import Migrate

from config import Config
from extensions import db, mail, bcrypt, jwt

from routes.auth_routes import auth_bp
from routes.land_routes import land_bp
from routes.contact_routes import contact_bp


CPANEL_HOME = os.environ.get('HOME')  
STATIC_FOLDER = os.path.join(CPANEL_HOME, 'public_html', 'static')
UPLOAD_FOLDER = os.path.join(STATIC_FOLDER, 'uploads')

# Ensure uploads folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(
    __name__,
    static_folder=STATIC_FOLDER,   
    static_url_path='/static'       
)
app.config.from_object(Config)

from flask_cors import CORS

CORS(
    app, 
    resources={r"/api/*": {"origins": ["http://localhost:3000", "https://royal-realty-ten.vercel.app/"]}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    supports_credentials=True,
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600
)



db.init_app(app)
mail.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

migrate = Migrate(app, db)

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

app.register_blueprint(auth_bp)
app.register_blueprint(land_bp)
app.register_blueprint(contact_bp)


LOG_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
os.makedirs(LOG_FOLDER, exist_ok=True)

# Log setup
log_file = os.path.join(LOG_FOLDER, 'app_errors.log')
handler = RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=5)
handler.setLevel(logging.ERROR)

formatter = logging.Formatter(
    '%(asctime)s [%(levelname)s] in %(module)s: %(message)s'
)
handler.setFormatter(formatter)

app.logger.addHandler(handler)

@app.route("/", methods=["GET", "OPTIONS"])
def home():
    if request.method == "OPTIONS":
        return "", 200
    return "Hello from royal realty"

if __name__ == "__main__":
    app.run(debug=True)
