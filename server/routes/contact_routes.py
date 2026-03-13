from flask import Blueprint, request
from services.contact_service import send_contact_message

contact_bp = Blueprint("contact", __name__, url_prefix="/api")

@contact_bp.route("/contact", methods=["POST"])
def contact():

    data = request.get_json()

    return send_contact_message(data)