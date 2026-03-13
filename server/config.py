import os
from datetime import timedelta
from dotenv import load_dotenv


load_dotenv()

# Detect if running on Truehost cPanel
CPANEL_HOME = os.environ.get('HOME')
PUBLIC_STATIC = os.path.join(CPANEL_HOME, 'public_html', 'static') if CPANEL_HOME else None

class Config:
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///instance/database.db")

    # Mail
    MAIL_SERVER = os.getenv("MAIL_SERVER", "localhost")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 25))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "False") == "True"
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "True") == "True"
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")

    # Paths
    STATIC_FOLDER = PUBLIC_STATIC or os.getenv("STATIC_FOLDER", "static")
    UPLOAD_FOLDER = os.path.join(STATIC_FOLDER, 'uploads')    