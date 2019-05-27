from flask import Flask
from flask import jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\\Users\\misma\\Desktop\\Projects\\FormBackend\\Users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date(), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.name

    def get_age():
        currentDate = datetime.datetime.now()
        age = currentDate.year - self.date.year
        return age

@app.route("/api", methods=['GET'])
def listAllUsers():
    users = User.query.all()
    list_of_users = []
    for user in users:
        user_details = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'password': user.password,
            'date': user.date.isoformat()
        }
        list_of_users.append(user_details)
    return jsonify(list_of_users)

@app.route("/api", methods=['POST'])
def post_users():
    user_data = request.get_json()

    name = user_data['name']
    email = user_data['email']
    password = user_data['password']
    date = datetime.datetime.strptime(user_data['dateOfBirth'], "%Y-%m-%d")

    user = User(name=name, email=email, password=password, date=date)
    db.session.add(user)
    db.session.commit()
    return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'password': user.password,
            'date': user.date.isoformat()
        })

@app.route("/", methods=['GET'])
def display_form():
    return send_from_directory('static', 'Form.html')

@app.route("/<page>", methods=['GET'])
def load_scripts(page):
    return send_from_directory('static', page)