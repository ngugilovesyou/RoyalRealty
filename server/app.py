import logging
from logging.handlers import RotatingFileHandler
import os
from flask import Flask, request, send_from_directory, Response
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from extensions import db, mail, bcrypt, jwt
from routes.auth_routes import auth_bp
from routes.land_routes import land_bp
from routes.contact_routes import contact_bp
from models import LandSubmission
from datetime import datetime

app = Flask(
    __name__
)

app.config.from_object(Config)

CORS(app,
     resources={r"/api/*": {"origins": [
         "http://royalrealty.co.ke",
         "https://royalrealty.co.ke",
         "https://www.royalrealty.co.ke"
     ]}},
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-CSRF-Token"
    ],
     supports_credentials=True,
     expose_headers=["Content-Type", "Authorization"],
     max_age=3600)

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

log_file = os.path.join(LOG_FOLDER, 'app_errors.log')
handler = RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=5)
handler.setLevel(logging.ERROR)
formatter = logging.Formatter('%(asctime)s [%(levelname)s] in %(module)s: %(message)s')
handler.setFormatter(formatter)
app.logger.addHandler(handler)

@app.route("/", methods=["GET", "OPTIONS"])
def home():
    if request.method == "OPTIONS":
        return "", 200
    return "Hello from royal realty"

@app.route('/static/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/sitemap.xml")
def sitemap():
    base_url = "https://royalrealty.co.ke"

    lands = LandSubmission.query.filter_by(status="approved").all()

    urls = []

    # Static pages
    static_pages = [
        "/",
        "/lands",
        "/contact-us",
        "/sell-with-us",
        "/projects"
    ]

    for page in static_pages:
        urls.append(f"""
  <url>
    <loc>{base_url}{page}</loc>
  </url>
""")

    
    for land in lands:
        urls.append(f"""
  <url>
    <loc>{base_url}/lands/{land.slug}</loc>
    <lastmod>{land.reviewed_at.date() if land.reviewed_at else datetime.utcnow().date()}</lastmod>
  </url>
""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{''.join(urls)}
</urlset>"""

    return Response(xml, mimetype="application/xml") 
    
if __name__ == "__main__":
    app.run(debug=True)