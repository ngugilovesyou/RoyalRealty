from flask import jsonify
from models import Admin
from extensions import db, bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity


def create_admin(email,password):

    existing_admin = Admin.query.filter_by(email=email).first()

    if existing_admin:
        return jsonify({"error":"Admin exists"}),400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")

    admin = Admin(email=email,password=hashed)

    db.session.add(admin)
    db.session.commit()

    return jsonify({"message":"Admin created","email":email}),201


def login_admin(data):

    email = data.get("email")
    password = data.get("password")

    admin = Admin.query.filter_by(email=email).first()

    if admin and bcrypt.check_password_hash(admin.password,password):

        token = create_access_token(identity=email)

        return jsonify({
            "success":True,
            "access_token":token,
            "admin":{"email":admin.email,"id":admin.id}
        }),200

    return jsonify({"error":"Invalid credentials"}),401


def verify_admin_token():

    email = get_jwt_identity()

    admin = Admin.query.filter_by(email=email).first()

    if admin:
        return jsonify({
            "success":True,
            "admin":{"email":admin.email,"id":admin.id}
        }),200

    return jsonify({"error":"Admin not found"}),404