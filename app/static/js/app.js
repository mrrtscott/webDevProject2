/* Add your Application JavaScript */
/*global localStorage */

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div id="img_nav">
        <a><i class="fa fa-camera" aria-hidden="true"></i></a>
        <img>  
        <a class="navbar-brand appname" href="#">Photogram</a>
    </div>
    <div class="navContents">

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/explore">Explore <span class="sr-only"></span></router-link>
            </li>
            <li class="nav-item active">
                         <span class="nav-link" @click="MyProfile">My Profile</span>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/logout">Logout <span class="sr-only"></span></router-link>
            </li>
            </ul>
        </div>
    </div>
     
    </nav>

    `,
    methods: {
        MyProfile: function() {
            let userId;
            try {
                userId = localStorage.getItem('userid');
                router.push('/users/' + userId);
            } catch (e) {
                router.push('/login')
            }
        }
    },
    data: function() {
        return {}
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Neisha,Jordanne,Romaro.</p>
        </div>
    </footer>
    `
});

const Register = Vue.component('register', {
    template: `
    <div class="maindiv new">
        <div class="register_word">
            <p>Register</p>
        </div>
            <div class="register_form">
                <form @submit.prevent="registration" enctype="multipart/form-data" id="signupForm">
                
                    <div class="form-group">
                        <label for ="username">Username</label>
                        <input type="text" name="username" id="username" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label for ="password">Password</label>
                        <input type="password" name="password" id="password" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label for ="firstname">Firstname</label>
                        <input type="text" name="firstname" id="firstname" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label for ="lastname">Lastname</label>
                        <input type="text" name="lastname" id="lastname" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label for ="email">Email</label>
                        <input type="email" name="email" id="email" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label for ="location">Location</label>
                        <input type="text" name="location" id="location" class="form-control"/>
                    </div>

                    <div class="form-group">
                        <label for ="biography">Biography</label>
                        <div class="biography">
                            <textarea  name="biography" id="biography" rows="4" cols="56" coclass="form-control"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="reg_label">
                            <label for ="photo">Photo</label>
                        </div>
                        <input type="file" name="photo" id="photo">

                    </div>

                    <div class="register_button">
                        <button type="submit" name="register" class="btn btn-success">Register</button>
                    </div>

                </form>
            </div>
    </div>
    `,
    methods: {
        registration: function() {
            let self = this;
            let signupForm = document.getElementById('signupForm');
            let formdata = new FormData(signupForm);
            fetch("/api/users/register", {

                    method: 'POST',
                    body: formdata,
                    headers: {
                        'X-CSRFToken': token
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse);

                    console.log(jsonResponse.message);
                    if (jsonResponse.message == "User successfully registered") {
                        // redirect to login page
                        router.push('/login');

                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }

});

const Login = Vue.component('login', {
    template: `
    <div class="maindiv new">
            <div>
                {{message}}
            </div>
                <div class="login_word">
                    <p>Login</p>
                </div>
                <form @submit.prevent="login" enctype="multipart/form-data" id="loginForm">
                    <div id="user_login">

                        <div class="form-group">
                            <label for ="username">Username</label>
                            <input type="text" name="username" id="username" class="form-control" required/>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" name="password" id="password" class="form-control" required />
                        </div>

                        <div class="login_button">
                            <button type="submit" name="login" class="btn btn-success">Login</button>
                        </div>
                    </div>
                </form>
              
        
    </div>
    `,
    methods: {
        login: function() {
            let self = this;
            let loginForm = document.getElementById('loginForm');
            let formdata = new FormData(loginForm);
            fetch("/api/auth/login", {

                    method: 'POST',
                    body: formdata,
                    headers: {
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse.message);
                    if (jsonResponse.message == "User successfully logged in!") {
                        localStorage.setItem('token', jsonResponse.token);
                        localStorage.setItem('userid', jsonResponse.id);

                        router.push('/explore');

                    } else if (jsonResponse.message == "Username or Password Incorrect") {
                        self.message = jsonResponse.message;
                    }

                })
                .catch(function(error) {
                    console.log(error)
                });

        }
    },
    data: function() {
        return {
            message: ""
        }
    }

});

const User_profile = Vue.component('user-profile', {
    template: `
    <div class="userprofilediv">
        <div id="userheader">
            <img class="profilephoto" v-bind:src="'../static/uploads/' + photo"/>
            <div id="middle">
                <ul>
                    <li id="firstname" class="user_firstname">{{firstname}} {{lastname}}</li>
                    <li id="locationli">{{location}}</li>
                    <li>Member since {{joined_on}}</li>
                    <li id="biographyli"> {{biography}}</li>
                </ul>

                
            </div>
            <div id="followers">
              <div id="row1">
                    <li class="post_num">{{postcount}}</li>
                    <li class="followers_num">{{followcount}}</li>
                    <li>Posts</li>
                    <li >Followers</li>
               
               
              </div>
              <div class="follow_button">
                <button v-on:click="followuser()" v-if="follow=='following' && user_id!=currentuser_id" id="followbtn" class="btn btn-success"> Following</button>
                <button  v-on:click="followuser()" v-if="follow=='not following' && user_id!=currentuser_id" id="followbtn" class="btn btn-primary"> Follow</button>
              </div>
            </div>
        </div>

        <div id="gallery">
            <ul class="image__list">
                <li v-for="post in posts" class="image__item"> <img v-bind:src="'../static/uploads/' + post.photo""/>
                </li>
            </ul>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        fetch("/api/users/" + self.id + "/posts", {
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                if (jsonResponse.code == "token_invalid_signature") {
                    router.push('/login');

                }
                console.log(jsonResponse);
                // self.message=data.message
                self.firstname = jsonResponse.firstname;
                self.posts = jsonResponse.posts;
                self.lastname = jsonResponse.lastname;
                self.username = jsonResponse.username;
                self.joined_on = jsonResponse.joinedon;
                self.location = jsonResponse.location;
                self.biography = jsonResponse.biography;
                self.photo = jsonResponse.photo;
                self.user_id = jsonResponse.user_id;
                self.follow = jsonResponse.follow;
                self.followcount = jsonResponse.followcount;
                self.postcount = jsonResponse.postcount;
                // router.push('login');


            })
            .catch(function(error) {
                console.log(error);
            });
    },
    methods: {
        followuser: function() {
            let self = this;
            fetch("/api/users/" + self.id + "/follow", {

                    method: 'POST',
                    headers: {
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message
                    console.log(jsonResponse.message);
                    self.followcount++;
                    self.follow = "following";

                })
                .catch(function(error) {
                    console.log(error);
                });



        }
    },
    data: function() {
        return {
            id: this.$route.params.user_id,
            posts: [],
            firstname: "",
            lastname: "",
            username: "",
            joined_on: "",
            location: "",
            biography: "",
            photo: "",
            user_id: 0,
            follow: "",
            followcount: 0,
            postcount: 0,
            currentuser_id: localStorage.getItem('userid')

        }
    }
});


const Newpost = Vue.component('newpost', {
    template: `
    <div class="maindiv new">

        <div class="newpost_word">
            <p>New Post</p>
        </div>
       
            <form @submit.prevent="uploadpost" enctype="multipart/form-data" id="uploadForm">

                <div class="newpost_div">
        
                    <div class="form-group">
                        <div class="post_photo">
                            <label class="label" for="photo">Photo</label>
                        </div>
                        <input name="photo" id="photo" type="file" >
                    </div>

                    <div class="form-group">
                        <label class="label" for="caption">Caption</label>
                        <textarea class="form-control" name="caption" id="caption" placeholder="Enter description here" ></textarea>
                    </div>

                    <div class="postsubmit_button">
                        <button class="btn btn-success" id="newpostsubmitbtn"> Submit</button>
                    </div>

                </div>

            </form>
    </div>
    `,
    methods: {
        uploadpost: function() {
            self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            let userid = localStorage.getItem('userid');
            fetch("/api/users/" + userid + "/posts", {

                    method: 'POST',
                    body: form_data,
                    headers: {
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message
                    //undefined - no erros
                    console.log(jsonResponse.message)
                    if (jsonResponse.message == "Successfully created a post!") {
                        router.push('/explore');
                    }



                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {
            id: 0,
            messages: ""

        }
    }
});



const Explore = Vue.component('explore', {
    template: `
    <div id="explore_main">       
        <ul>
            <li  class="card" id="card" style="width: 40rem; height:50rem;" v-for="(post,index) in posts" >
        
                <div  id="cardlay">
                    <ul>
                        <div id="posted_img" v-on:click="profile(index)">
                            
                            <li id="userinfo"><img class="userprofilephoto" v-bind:src="'../static/uploads/' + post.profile_photo"/> <a class="explore_name"> {{post.username}} </a></li>
                        </div>
                    </ul>
                        <div class="posted_img">
                            <li id="postphoto"><img class="postphoto" v-bind:src="'../static/uploads/' + post.photo"/></li>
                        </div>
                        <div class="caption">
                            <li>{{post.caption}}</li>
                        </div>
                       
                       
                </div>

                <div  id="likendate">
            
                        <li> 
                            <i v-if="post.liked=='liked'" class="fa fa-heart" aria-hidden="true"></i> 
                            <a> 
                                <i  v-on:click="likephoto(post.post_id,index)" v-if="post.liked=='not liked'" class="fa fa-heart-o" aria-hidden="true"></i>
                            </a> 
                            {{post.no_likes}} Likes
                        </li>
                        <li id="createdate">{{ post.created_on}}</li>
                    </div>
            </li>
        </ul>
        <div class= newpost_button>
         <button v-on:click="createpost" class="btn btn-primary" id="newpostbtn"> New Post</button>
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        fetch("/api/posts", {
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                if (jsonResponse.code == "token_invalid_signature") {
                    router.push('/login');

                }
                console.log(jsonResponse);
                // self.message=data.message
                self.posts = jsonResponse.posts;
                self.username = jsonResponse.username;
                self.photo = jsonResponse.photo;


            })
            .catch(function(error) {
                console.log(error);
            });
    },
    data: function() {
        let self = this;
        return {
            posts: [],
            username: "",
            photo: "",
        }
    },
    methods: {
        createpost: function(event) {

            router.push('/posts/new');

        },
        profile: function(index) {
            router.push('/users/' + this.posts[index].user_id)
        },
        likephoto: function(postid, index) {
            let formData = new FormData();
            let self = this;
            formData.set('post_id', postid);

            fetch("/api/posts/" + postid + "/like", {

                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': token,
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message

                    console.log(jsonResponse.message)
                    self.posts[index].liked = "liked";
                    self.posts[index].no_likes++;

                })
                .catch(function(error) {
                    console.log(error);
                });

        }
    }
});


const Home = Vue.component('home', {
    template: `
    <div class="maindiv">
        <div class="homediv">
            <img id="sidepic" src ="/static/images/left_home_img.png" /> 
            <div id="logreg">
                <div class=rightside_home>
                    <a class="appname"><i class="fa fa-camera" aria-hidden="true"></i> Photogram</a>
                    <hr>
                    <p>Share photos of your favourite momemnts with friends,family and the world</p>
                    <div class="buttons">
                        <button v-on:click="register" class="btn btn-success" id="register_button"> Register</button> 
                        <button v-on:click="login" class="btn btn-primary" id="login_button"> Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
   `,
    methods: {
        register: function(event) {

            router.push('/register');

        },
        login: function(event) {
            router.push('/login');
        }
    },
    data: function() {
        return {}
    }
});

const Logout = Vue.component('logout', {
    template: `
  <div></div>
    `,

    created: function() {
        let self = this;
        fetch('/api/auth/logout', {
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // self.message=data.message
                if (data.code == "token_invalid_signature") {
                    router.push('/login');

                } else {
                    console.log(data);
                    localStorage.removeItem('token');
                    router.push('/');
                }


            });
    },

    data: function() {
        return {
            // message:''
        }
    }
})
const NotFound = Vue.component('not-found', {
    template: `
    <div class="maindiv">  
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function() {
        return {}
    }
});

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: "/", component: Home },
        // Put other routes here
        { path: "/register", component: Register },
        { path: "/login", component: Login },
        { path: "/logout", component: Logout },
        { path: "/explore", component: Explore },
        { path: "/users/:user_id", component: User_profile },
        { path: "/posts/new", component: Newpost },
        // This is a catch all route in case none of the above matches
        { path: "*", component: NotFound }
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});