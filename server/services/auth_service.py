from flask import jsonify
from models import Admin
from extensions import db, bcrypt
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies,
)
from sqlalchemy import func
import time
import re


MAX_FAILED_ATTEMPTS = 5
LOCK_TIME_SECONDS = 900  # 15 minutes


def valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email)


def valid_password(password):
    return len(password) >= 8


def create_admin(email, password):

    email = email.strip().lower()

    if not valid_email(email):
        return jsonify({"error": "Invalid email"}), 400

    if not valid_password(password):
        return jsonify({
            "error": "Password must be at least 8 characters"
        }), 400

    existing_admin = Admin.query.filter(
        func.lower(Admin.email) == email
    ).first()

    if existing_admin:
        return jsonify({"error": "Unable to create account"}), 400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")

    admin = Admin(
        email=email,
        password=hashed,
        failed_attempts=0,
        locked_until=None
    )

    db.session.add(admin)
    db.session.commit()

    return jsonify({
        "message": "Admin created"
    }), 201


def login_admin(data):

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Invalid credentials"}), 401

    admin = Admin.query.filter(
        func.lower(Admin.email) == email
    ).first()

    # Prevent timing attacks
    time.sleep(1)

    if not admin:
        return jsonify({"error": "Invalid credentials"}), 401

    # Check if account is locked
    if admin.locked_until and admin.locked_until > db.func.now():
        return jsonify({
            "error": "Account temporarily locked"
        }), 403

    if bcrypt.check_password_hash(admin.password, password):

        admin.failed_attempts = 0
        admin.locked_until = None
        db.session.commit()

        # Identity is the admin's id (as a string). Every protected route
        # must look this back up with db.session.get(Admin, id) — not by email.
        token = create_access_token(identity=str(admin.id))

        response = jsonify({
            "success": True,
            "admin": {
                "email": admin.email,
                "id": admin.id
            }
        })

     
        set_access_cookies(response, token)

        return response, 200

    # Failed login attempt
    admin.failed_attempts += 1

    if admin.failed_attempts >= MAX_FAILED_ATTEMPTS:
        from datetime import datetime, timedelta

        admin.locked_until = datetime.utcnow() + timedelta(
            seconds=LOCK_TIME_SECONDS
        )

        admin.failed_attempts = 0

    db.session.commit()

    return jsonify({"error": "Invalid credentials"}), 401


def logout_admin():
    response = jsonify({"success": True, "message": "Logged out successfully"})
    unset_jwt_cookies(response)
    return response, 200


def verify_admin_token():

    admin_id = get_jwt_identity()
    if not admin_id:
        return jsonify({"error": "Admin not found"}), 404

    admin = db.session.get(Admin, admin_id)

    if admin:
        return jsonify({
            "success": True,
            "admin": {
                "email": admin.email,
                "id": admin.id
            }
        }), 200

    return jsonify({"error": "Admin not found"}), 404