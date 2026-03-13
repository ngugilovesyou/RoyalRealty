from datetime import datetime
from extensions import db


class LandSubmission(db.Model):
    __tablename__ = "land_submissions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    contact_name = db.Column(db.String(120), nullable=False)
    telephone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)

    county = db.Column(db.String(100), nullable=False)
    town = db.Column(db.String(120), nullable=False)

    size = db.Column(db.String(100), nullable=False)
    asking_price = db.Column(db.String(100), nullable=False)

    additional_info = db.Column(db.Text)
    status = db.Column(db.String(20),default="pending")
    approved_by = db.Column(db.Integer,db.ForeignKey("admins.id"))

    reviewed_at=db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationship with images
    images = db.relationship(
        "LandImage",
        backref="land_submission",
        cascade="all, delete-orphan",
        lazy=True
    )

    @property
    def main_image(self):
        if self.images and len(self.images) > 0:
            return self.images[0].image_url
        return None


class LandImage(db.Model):
    __tablename__ = "land_images"

    id = db.Column(db.Integer, primary_key=True)

    image_url = db.Column(db.String(255), nullable=False)

    land_id = db.Column(
        db.Integer,
        db.ForeignKey("land_submissions.id"),
        nullable=False
    )