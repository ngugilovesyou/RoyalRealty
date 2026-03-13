from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.auth_service import create_admin, login_admin, verify_admin_token

auth_bp = Blueprint("auth", __name__, url_prefix="/api/admin")

@auth_bp.route("/register", methods=["POST"])
def register_admin():

    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    return create_admin(data["email"], data["password"])


@auth_bp.route("/login", methods=["POST","OPTIONS"])
def login():

    if request.method == "OPTIONS":
        return jsonify({"message":"OK"}),200

    data = request.get_json()

    return login_admin(data)


@auth_bp.route("/verify", methods=["GET"])
@jwt_required(optional=True)
def verify():

    return verify_admin_token()


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():

    return jsonify({
        "success":True,
        "message":"Logged out successfully"
    }),200