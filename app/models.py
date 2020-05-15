from datetime import datetime
from app import db,login
from flask_login import UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from hashlib import md5
# from app.search import add_to_index, remove_from_index, query_index


class SearchableMixin(object):
    @classmethod
    def search(cls, expression, page, per_page):
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return cls.query.filter_by(id=0), 0
        when = []
        for i in range(len(ids)):
            when.append((ids[i], i))
        return cls.query.filter(cls.id.in_(ids)).order_by(
            db.case(when, value=cls.id)), total


followers = db.Table(
    'follows',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

class Users(db.Model, UserMixin,SearchableMixin):
    __searchable__ = ['username']
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(150))
    lastname = db.Column(db.String(140))
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(300))
    biography = db.Column(db.String(140))
    location = db.Column(db.String(150))
    profile_photo  = db.Column(db.String(300))
    joined_on = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    # posts = db.relationship('Posts',backref='author', lazy='dynamic',passive_deletes=True )
    # posts_liked = db.relationship('Likes', backref='user', lazy='dynamic',passive_deletes=True)
    # followed = db.relationship(
    #     'Users', secondary=followers,
    #     primaryjoin=(followers.c.follower_id == id),
    #     secondaryjoin=(followers.c.followed_id == id),
    #     backref=db.backref('followers', lazy='dynamic'), lazy='dynamic',passive_deletes=True)
    
    def __init__(self,firstname, lastname, username, email,location,biography, imgProfile):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.email = email
        self.biography = biography
        self.profile_photo = imgProfile
        self.location=location
    


    def __repr__(self):
    	return '<Users {}>'.format(self.username)

    def set_password(self, password):
    	self.password = generate_password_hash(password)

    def check_password(self, password):
    	return check_password_hash(self.password, password)

    # def avatar(self, size):
    # 	digest = md5(self.email.lower().encode('utf-8')).hexdigest()
    # 	return ''	

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter( followers.c.followed_id == user.id).count() > 0

    
    def like_post(self, post):
        if not self.post_liked(post):
            like = Likes(user_id=self.id, post_id=post.id)
            db.session.add(like)

    def dislike_post(self, post):
        if self.post_liked(post):
            Likes.query.filter_by(user_id=self.id, post_id=post.id).delete()

    def post_liked(self, post):
        return Likes.query.filter(Likes.user_id == self.id,
               Likes.post_id == post.id).count() > 0



@login.user_loader
def load_user(id):
    return Users.query.get(int(id))

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    photo = db.Column(db.String(300))
    created_on = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    caption=db.Column(db.String(300))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    
    


    def __repr__(self):
        return '<Post {}>'.format(self.img)

    
class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id',ondelete='CASCADE'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id',ondelete='CASCADE'))
    created_on = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    def __init__(self,userid,post_id):
        self.user_id=userid
        self.post_id=post_id

    def __repr__(self):
        return '<Likes {}>'.format(self.id)

