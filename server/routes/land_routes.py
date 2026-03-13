from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required

from models.land import LandSubmission
from services.land_service import (
    get_rejected_lands,
    create_admin_land,
    get_approved_lands,
    get_pending_lands,
    sell_land_service,
    approve_land_service,
    reject_land_service,
    update_land_service,
    delete_land_service,
    public_lands_service
)

land_bp = Blueprint("lands", __name__, url_prefix="/api")

@land_bp.route("/sell-land", methods=["POST", "OPTIONS"])
def sell_land():
    if request.method == "OPTIONS":
        return "", 200
    return sell_land_service()

@land_bp.route("/admin/lands/pending", methods=["GET", "OPTIONS"])
@jwt_required()
def get_pending():
    if request.method == "OPTIONS":
        return "", 200
    return get_pending_lands()

@land_bp.route('/lands/approved', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_approved():
    """Get all approved land listings"""
    if request.method == "OPTIONS":
        return jsonify({"msg": "OK"}), 200
    return get_approved_lands()

@land_bp.route("/admin/lands/<int:land_id>/approve", methods=["PUT", 'OPTIONS'])
@jwt_required()
def approve_land(land_id):
    if request.method == "OPTIONS":
        return "", 200
    admin_email = get_jwt_identity()
    return approve_land_service(land_id, admin_email)


@land_bp.route("/admin/lands/<int:land_id>/reject", methods=["PUT"])
@jwt_required()
def reject_land(land_id):
    if request.method == "OPTIONS":
        return "", 200

    return reject_land_service(land_id)

@land_bp.route("/admin/get-rejected", methods=["GET","OPTIONS"])
@jwt_required()
def get_rejected():
    if request.method == "OPTIONS":
        return "", 200
    return get_rejected_lands()

@land_bp.route("/admin/lands/<int:land_id>", methods=["PUT", "OPTIONS"])
@jwt_required()
def update_land(land_id):
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()

    return update_land_service(land_id,data)


@land_bp.route("/admin/lands/<int:land_id>", methods=["DELETE", "OPTIONS"])
@jwt_required()
def delete_land(land_id):
    if request.method == "OPTIONS":
        return "", 200

    return delete_land_service(land_id)


@land_bp.route("/lands", methods=["GET", "OPTIONS"])
def public_lands():
    if request.method == "OPTIONS":
        return "", 200

    return public_lands_service()



@land_bp.route("/lands/featured", methods=["GET", "OPTIONS"])
def get_featured_lands():
    if request.method == "OPTIONS":
        return "", 200
    lands = (
        LandSubmission.query
        .filter_by(status="approved")
        .order_by(LandSubmission.created_at.desc())
        .limit(3)
        .all()
    )

    if not lands:
        return jsonify([])

    result = []
    for land in lands:
        # Generate full URLs for images
        image_urls = []
        for img in land.images:
            if img.image_url:
                # If it's already a full URL, use it
                if img.image_url.startswith(('http://', 'https://')):
                    image_urls.append(img.image_url)
                else:
                    # Generate a URL to your Flask static endpoint
                    image_urls.append(url_for('static', filename=img.image_url.replace('static/', ''), _external=True))
        
        result.append({
            "id": land.id,
            "title": land.title or f"{land.county} Land",
            "county": land.county,
            "town": land.town,
            "location": f"{land.town}, {land.county}",
            "price": land.asking_price,
            "size": land.size,
            "additional_info": land.additional_info,
            "images": image_urls,
            "main_image": land.main_image
        })

    return jsonify(result)


# In your routes
@land_bp.route('/admin/lands/<int:land_id>', methods=['GET', "OPTIONS"])
@jwt_required()
def get_land_by_id(land_id):
    if request.method == "OPTIONS":
        return "", 200
    land = LandSubmission.query.get(land_id)
    if not land:
        return jsonify({"error": "Land not found"}), 404
    return jsonify({
        "id": land.id,
        "title": land.title,
        "contact_name": land.contact_name,
        "telephone": land.telephone,
        "email": land.email,
        "county": land.county,
        "town": land.town,
        "size": land.size,
        "asking_price": land.asking_price,
        "additional_info": land.additional_info,
        "status": land.status,
        "images": [
    img.image_url if img.image_url.startswith(("http://", "https://"))
    else url_for("static", filename=img.image_url.replace("static/", ""), _external=True)
    for img in land.images
]
    }), 200

@land_bp.route("/admin/lands/create", methods=["POST", "OPTIONS"])
@jwt_required()
def create_admin_lands():
    if request.method == "OPTIONS":
        return "", 200
    return create_admin_land()