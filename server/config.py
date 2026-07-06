import os
from datetime import timedelta
from dotenv import load_dotenv


load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Config:
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True          
    JWT_COOKIE_SAMESITE = "Lax"       
    JWT_ACCESS_COOKIE_PATH = "/api"   
    JWT_COOKIE_CSRF_PROTECT = True    
    JWT_CSRF_IN_COOKIES = True       
    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN" 

    # Database
    # SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///instance/database.db")
    SQLALCHEMY_DATABASE_URI = "postgresql://wgldkyxd_royal_user:MosesNtiono#12345@localhost:5432/wgldkyxd_royal_realty"

    # Mail
    MAIL_SERVER = os.getenv("MAIL_SERVER", "localhost")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 25))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "False") == "True"
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "True") == "True"
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")

    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')   