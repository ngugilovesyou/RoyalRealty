import os
import uuid
from datetime import datetime
from flask import request, jsonify, url_for
from werkzeug.utils import secure_filename
from models import LandSubmission, LandImage, Admin
from extensions import db
from flask_jwt_extended import get_jwt_identity
from flask import current_app
from config import Config

def get_approved_lands():
    """Get all approved land listings for admin management"""
    try:
        # Verify admin authentication
        admin_email = get_jwt_identity()
        admin = Admin.query.filter_by(email=admin_email).first()
        
        if not admin:
            return jsonify({"error": "Unauthorized"}), 401

        # Get all lands with 'approved' status
        approved_lands = LandSubmission.query.filter_by(status="approved").all()
        
        result = []
        for land in approved_lands:
            # Get the admin who approved this land
            approved_by_admin = Admin.query.get(land.approved_by) if land.approved_by else None
            
            result.append({
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
                "created_at": land.created_at.isoformat() if land.created_at else None,
                "approved_at": land.reviewed_at.isoformat() if land.reviewed_at else None,
                "approved_by": approved_by_admin.email if approved_by_admin else None,
                "images": [
                img.image_url if img.image_url.startswith(("http://", "https://"))
                    else url_for("static", filename=img.image_url.replace("static/", ""), _external=True)
                    for img in land.images
                ],
                "main_image": land.main_image
            })
        
        return jsonify({
            "status": "success",
            "lands": result,
            "count": len(result)
        }), 200
        
    except Exception as e:
        print(f"Error fetching approved lands: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
def sell_land_service():
    try:
        contact_name = request.form.get("contactName")
        telephone = request.form.get("telephone")
        email = request.form.get("email")
        county = request.form.get("county")
        town = request.form.get("town")
        size = request.form.get("size")
        asking_price = request.form.get("askingPrice")
        additional_info = request.form.get("additionalInfo")
        title = request.form.get("title") or f"{county} Land"  # fallback title

        submission = LandSubmission(
            title=title,
            contact_name=contact_name,
            telephone=telephone,
            email=email,
            county=county,
            town=town,
            size=size,
            asking_price=asking_price,
            additional_info=additional_info
        )

        db.session.add(submission)
        db.session.commit()

        image_urls = []
        

        for key in request.files:
            file = request.files[key]
            if file and file.filename != "":
                filename = secure_filename(file.filename)
                unique_name = f"{uuid.uuid4()}_{filename}"
                
                filepath = os.path.join(Config.UPLOAD_FOLDER, unique_name)
                file.save(filepath)
                image_url = url_for(
                "static",
                filename=f"uploads/{unique_name}",
                _external=True
            )
                image_urls.append(image_url)

                image = LandImage(image_url=image_url, land_id=submission.id)
                db.session.add(image)

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Land submitted successfully",
            "images": image_urls,
            "title": submission.title,
            "main_image": submission.main_image
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500


def approve_land_service(land_id, admin_email):

    admin = Admin.query.filter_by(email=admin_email).first()
    
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

    land=LandSubmission.query.get(land_id)

    if not land:
        return jsonify({"error":"Land not found"}),404

    land.status="approved"
    land.approved_by=admin.id
    land.reviewed_at=datetime.utcnow()

    db.session.commit()

    return jsonify({"message":"Land approved"})



def get_rejected_lands():
    """Fetch all rejected land listings for admin management"""
    # Verify admin authentication
    admin_email = get_jwt_identity()
    admin = Admin.query.filter_by(email=admin_email).first()
    
    if not admin:
        return jsonify({"error": "Unauthorized"}), 401

    # Query rejected lands
    rejected_lands = LandSubmission.query.filter_by(status="rejected").all()

    # Format results for response
    results = []
    for land in rejected_lands:
        results.append({
            "id": land.id,
            "title": land.title,
            "county": land.county,
            "town": land.town,
            "size": land.size,
            "asking_price": land.asking_price,
            "additional_info": land.additional_info,
            "contact_name": land.contact_name,
            "telephone": land.telephone,
            "email": land.email,
            "created_at": land.created_at,
            "images": [img.image_url for img in land.images]  
        })

    return jsonify(results), 200

def reject_land_service(land_id):

    admin_email=get_jwt_identity()
    admin=Admin.query.filter_by(email=admin_email).first()

    land=LandSubmission.query.get(land_id)

    if not land:
        return jsonify({"error":"Land not found"}),404

    land.status="rejected"
    land.approved_by=admin.id
    land.reviewed_at=datetime.utcnow()

    db.session.commit()

    return jsonify({"message":"Land rejected"})


def get_pending_lands():
    """Get all pending land submissions for admin review"""
    try:
        # Get all lands with 'pending' status
        pending_lands = LandSubmission.query.filter_by(status="pending").all()
        
        result = []
        for land in pending_lands:
            result.append({
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
                "created_at": land.created_at.isoformat() if land.created_at else None,
                "images": [
                img.image_url if img.image_url.startswith(("http://", "https://"))
                else url_for("static", filename=img.image_url.replace("static/", ""), _external=True)
                for img in land.images
            ]
            })
        
        return jsonify({
            "status": "success",
            "lands": result
        }), 200
        
    except Exception as e:
        print(f"Error fetching pending lands: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
def update_land_service(land_id,data):

    land=LandSubmission.query.get(land_id)

    if not land:
        return jsonify({"error":"Land not found"}),404

    land.county=data.get("county",land.county)
    land.town=data.get("town",land.town)
    land.size=data.get("size",land.size)
    land.asking_price=data.get("asking_price",land.asking_price)
    land.additional_info=data.get("additional_info",land.additional_info)

    db.session.commit()

    return jsonify({"message":"Land updated"})


def delete_land_service(land_id):

    land=LandSubmission.query.get(land_id)

    if not land:
        return jsonify({"error":"Land not found"}),404
    for img in land.images:
        if img.image_url:
            file_path = img.image_url.lstrip("/")

            if os.path.exists(file_path):
                os.remove(file_path)

    db.session.delete(land)
    db.session.commit()

    return jsonify({"message":"Land deleted"})


def public_lands_service():

    lands=LandSubmission.query.filter_by(status="approved").all()

    result=[]

    for land in lands:

        result.append({
            "id":land.id,
            "county":land.county,
            "town":land.town,
            "size":land.size,
            "price":land.asking_price,
            "additional_info":land.additional_info,
            "images":[img.image_url for img in land.images]
        })

    return jsonify(result)



def create_admin_land():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        # Verify admin
        admin_email = get_jwt_identity()
        admin = Admin.query.filter_by(email=admin_email).first()
        
        if not admin:
            return jsonify({"error": "Admin not found"}), 403
        
        # Get form data
        title = request.form.get("title")
        county = request.form.get("county")
        town = request.form.get("town")
        size = request.form.get("size")
        asking_price = request.form.get("askingPrice")
        additional_info = request.form.get("additionalInfo")
        
        admin_name = admin.email.split('@')[0] 
        
        contact_name = request.form.get("contact_name") or admin_name
        telephone = request.form.get("telephone") or "N/A"
        email = request.form.get("email") or admin.email
        
        # Validate required fields
        if not all([county, town, size, asking_price]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create submission with auto-approval
        submission = LandSubmission(
            title=title or f"{county} Land",
            contact_name=contact_name,
            telephone=telephone,
            email=email,
            county=county,
            town=town,
            size=size,
            asking_price=asking_price,
            additional_info=additional_info,
            status='approved',
            approved_by=admin.id,
            reviewed_at=datetime.utcnow()
        )
        
        db.session.add(submission)
        db.session.flush()  # Get the ID without committing
        
        # Handle image uploads
        image_urls = []
        upload_folder = os.path.join('static', 'uploads')
        
        # Create upload folder if it doesn't exist
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        for key in request.files:
            file = request.files[key]
            if file and file.filename != "":
                # Validate file type
                allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
                if '.' not in file.filename or \
                   file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
                    continue
                
                # Secure filename and save
                filename = secure_filename(file.filename)
                unique_name = f"{uuid.uuid4()}_{filename}"
                filepath = os.path.join(upload_folder, unique_name)
                file.save(filepath)
                
                # Generate URL
                image_url = url_for(
                    "static",
                    filename=f"uploads/{unique_name}",
                    _external=True
                )
                image_urls.append(image_url)
                
                # Save to database
                image = LandImage(
                    image_url=image_url,
                    land_id=submission.id
                )
                db.session.add(image)
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Land listing created successfully",
            "id": submission.id,
            "images": image_urls,
            "main_image": submission.main_image
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating admin land: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500