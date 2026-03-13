from flask import jsonify
from models import ContactMessage
from extensions import db, mail
from flask_mail import Message


def send_contact_message(data):

    name=data.get("name")
    email=data.get("email")
    message_text=data.get("message")

    if not name or not email or not message_text:
        return jsonify({"error":"All fields required"}),400

    message=ContactMessage(name=name,email=email,message=message_text)

    db.session.add(message)
    db.session.commit()

    msg=Message(
        subject=f"New Message from {name}",
        recipients=["info@royalrealty.co.ke"]
    )

    msg.body=f"""
Name:{name}
Email:{email}

Message:
{message_text}
"""

    mail.send(msg)

    return jsonify({"message":"Message sent"})