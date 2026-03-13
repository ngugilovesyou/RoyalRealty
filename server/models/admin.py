from extensions import db
class Admin(db.Model):
    __tablename__ = "admins"
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password=db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"<Admin {self.email}>"