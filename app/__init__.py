from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
import psycopg2
from flask_wtf.csrf import CSRFProtect 

from flask import render_template
app = Flask(__name__)
# SQLALCHEMY_DATABASE_URI ="postgresql://webdev:12345678@localhost/webDevProject2"
SQLALCHEMY_DATABASE_URI = "postgres://pyogevjdhhpdbe:dd8dca38e3a5ccb55e7e4eb4f1b0d2b1cb29a624ef71e182552480b86bdfdd6f@ec2-52-87-135-240.compute-1.amazonaws.com:5432/d7gshjrv8bbr12"
SQLALCHEMY_TRACK_MODIFICATIONS = False
UPLOAD_FOLDER = "./app/static/uploads"
SECRET_KEY = 'Sup3r$3cretkey'
app.config.from_object(__name__)
csrf = CSRFProtect(app)
db = SQLAlchemy(app)
login = LoginManager(app) 
login.init_app(app)
login.login_view = 'login'

from app import views

