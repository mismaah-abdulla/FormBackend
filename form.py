from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\\Users\\intern.tsd\\Desktop\\FormBackend\\Users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime(), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.name

@app.route("/")
def listAllUsers():
    users = User.query.all()
    list_of_users = []
    for user in users:
        user_dict = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'password': user.password,
            'date': user.date.isoformat()
        }
        list_of_users.append(user_dict)
    return jsonify(list_of_users)
