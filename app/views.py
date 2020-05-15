import os
from app import app, db
from flask import render_template, flash, request,make_response, redirect, url_for, jsonify, json
from app.forms import RegistrationForm, LoginForm,PostForm
from app.models import Users, Posts, Likes
from flask_login import login_required,current_user, login_user,logout_user
from flask import g
# from app.forms import SearchForm
from werkzeug.utils import secure_filename
from datetime import datetime
import random, time




@app.route('/api/users/register', methods=['POST'])
def register():
    form = RegistrationForm()
    if request.method=="POST":
        username=form.username.data
        password=form.password.data
        firstname=form.firstname.data
        lastname=form.lastname.data
        location=form.location.data
        email=form.email.data
        biography=form.biography.data
        photourl=form.photo.data 
        filename=secure_filename(photourl.filename)
        photourl.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        user = Users(firstname,lastname,username,email,location,biography,filename)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User successfully registered"}) 
    return jsonify(error= form_errors(form)),201

@app.route('/api/users/<user_id>/posts',methods=['GET','POST'])
def userpost(user_id):
    if request.method == 'POST':
        form = PostForm()
        # if form.validate_on_submit():
        caption = form.caption.data
        
        photo = form.photo.data
        filename = photo.filename
        photo.save(os.path.join(
            app.config['UPLOAD_FOLDER'], filename
        ))
        
        
        post = Posts(user_id, filename, caption)

        db.session.add(post)
        db.session.commit()
        return jsonify({'message': 'Successfully created a post!'}),201
  
    allpost=[]
    posts=Posts.query.filter_by(user_id=user_id).all()
    user=Users.query.filter_by(id=user_id).first()

    for post in posts:
        # getusername of post creator
        
        likes= Likes.query.filter_by(post_id=post.id).count()
        allpost.append({'id': post.id , 'user_id': post.user_id, 
            'photo': post.photo, 'caption': post.caption,
            'no_likes': likes, 'created_on': post.created_on})

    return jsonify({'username':user.username,'firstname':user.firstname,'lastname':user.lastname,'location':user.location,'joinedon':user.joined_on,'biography':user.biography,'photo':user.profile_photo,'posts':allpost}),200


@app.route('/api/posts', methods=['GET'])
#@login_required
def posts():
    allpost=[]
    posts=Posts.query.all()
    for post in posts:
        # getusername of post creator
        user=Users.query.filter_by(id=post.user_id).first()
        likes= Likes.query.filter_by(post_id=post.id).count()
        allpost.append({'username': user.username , 'user_id': post.user_id, 
            'photo': post.photo, 'caption': post.caption,
            'no_likes': likes, 'created_on': post.created_on,'profile_photo':user.profile_photo})

    return jsonify({"posts":allpost}),200

@app.route('/api/posts/<post_id>/like',methods=['POST'])
def addlikes(post_id):
    like = Likes(current_user.id,post_id)
    db.session.add(like)
    db.session.commit()
    return jsonify({"message":"liked"}),201


@app.route('/api/users/<user_id>/follow')
def followuser(user_id):
    follow=Follow(current_user.id,user_id)
    db.session.add(follow)
    db.session.commit()
    return jsonify({"message":"followed user"}),201

@app.route('/api/auth/login', methods=['POST'])
def login():
    # if current_user.is_authenticated:
    #     return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            # flash('Invalid username or password')
            # return redirect(url_for('login'))
            return jsonify({"message": "Username or Password Incorrect"}) 

       	login_user(user)
        return jsonify({"message": "User successfully logged in"}) 
    return jsonify(error= form_errors(form)),200


@app.route('/api/auth/logout')
#@login_required
def logout():
    logout_user()
    return jsonify({"message": "User successfully logged out"}),200


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".
    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")