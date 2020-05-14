/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div>
        <img>  
        <a class="navbar-brand" href="#">Photogram</a>
    </div>
    <div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/users/userid">My Profile <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
            </li>
            </ul>
        </div>
    </div>
     
    </nav>
    `
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
        <div class="register_form">
            <form @submit.prevent="registration" enctype="multipart/form-data" id="signupForm">
            
                <div class="form-group">
                    <label for ="username">Username</label>
                    <input type="text" name="username" id="username" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="password">Password</label>
                    <input type="password" name="password" id="password" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="firstname">Firstname</label>
                    <input type="text" name="firstname" id="firstname" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="lastname">lastname</label>
                    <input type="text" name="lastname" id="lastname" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="email">Email</label>
                    <input type="email" name="email" id="email" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="location">Location</label>
                    <input type="text" name="location" id="location" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="biography">Biography</label>
                    <textarea  name="biography" id="biography" rows="4" cols="60" coclass="form_control"/>
                </div>

                <div class="form-group">
                    <label for ="photo">Photo</label>
                    <input type="file" name="photo" id="photo">

                </div>

                <div class="register_button">
                    <button type="submit" name="register" class="btn btn-success">Register</button>
                </div>

            </form>
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
                    // headers: {
                    //     'X-CSRFToken': token
                    // }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse.errors);
                    if (jsonResponse.message == "added") {
                        console.log(jsonResponse.message);
                        // redirect to login page
                        router.push('login');

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
        <div class="login">
            <form @submit.prevent="login" enctype="multipart/form-data" id="loginForm">

                <div class="form-group">
                    <label for ="username">Username</label>
                    <input type="text" name="username" id="username" class="form_control"/>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password id="password" class="form-group">
                </div>

                <div class="login_button">
                    <button type="submit" name="login" class="btn btn-success">Login</button>
                </div>

            </form>
        </div>   
    
    `,
    methods: {
        login = function() {
            let self = this;
            let loginForm = document.getElementById('loginForn');
            let formdata = new FormData('loginForm');
            fetch("/api/users/login", {

                    method: 'POST',
                    body: formdata,
                    // headers: {
                    //     'X-CSRFToken': token
                    // }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse.errors);
                    if (jsonResponse.message == "successful") {
                        console.log(jsonResponse.message);
                        router.push('explore');
                    }

                })
                .catch(function(error) {
                    console.log(error)
                });

        }
    }

});

const User_profile = Vue.component('user-profile', {
    template: `
        <div id="userheader">
            <img src=""/>
            <div>
                <ul>
                    <li>firstname last ame</li>
                    <li>location=</li>
                    <li>Member since january 2018</li>
                    <li>bio</li>
                </ul>

                
            </div>
            <div id="followers">
              <div id="row1">
                <ul>
                    <li>post counter</li>
                    <li>followers counter</li>
                    <li>Posts</li>
                    <li>Followers</li>
                </ul>
               
              </div>
              <button> Follow</button>
            </div>
        </div>

        <div>
        for images 
        <ul class="image__list">
            <li v-for="image in images" class="image__item"> <img src="image.urlToImage"/>
            </li>
          </ul>
        </div>
    
    `,
    methods: {
        uploadpost: function() {
            let self = this;

            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/users/" + self.id + "/posts", {
                    method: 'GET',
                    // headers: {
                    //     'X-CSRFToken': token
                    // },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse);
                    self.posts = jsonResponse.posts;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {
            id: this.$route.params.user_id,
            posts: []

        }
    }
});


const New_post = Vue.component('new-post', {
    template: `
    <div>
        <form @submit.prevent="uploadpost" enctype="multipart/form-data" id="uploadForm">
            <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
                {{message}}
            </div>
            <div class="alert alert-danger" role="alert"  v-if="on && !success" >
                <div v-for="message in messages">
                    <li> {{message}}</li>

                </div>
            </div>
  

            <div class="form-group">
                <label for="photo">Photo</label>
                <input name="photo" id="photo" type="file">
            </div>

            <div class="form-group">
            <label for="description">Caption</label>
            <textarea class="form-control" name="description" id="description" placeholder="Enter description here"></textarea>
        </div>
             <button type=submit class="btn btn-primary" > Submit </button>
        </form>
    </div>
    `,
    methods: {
        uploadpost: function() {
            self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/users/${user_id}/posts", {

                    method: 'POST',
                    body: form_data,
                    // headers: {
                    //     'X-CSRFToken': token
                    // },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message
                    //undefined - no erros
                    console.log(jsonResponse.errors)
                    if (jsonResponse.errors != undefined) {
                        console.log(jsonResponse)
                        nextjson = jsonResponse.errors.replace("['", "");
                        nextjson = nextjson.replace("']", "");
                        nextjson = nextjson.replace("'", "");
                        nextjson = nextjson.replace("'E", "E");
                        self.messages = nextjson.split(",")
                        self.on = true;
                        self.success = false;
                    } else {
                        console.log(jsonResponse)
                        self.messages = [jsonResponse.message];
                        self.on = true;
                        self.success = true;
                        // change route to explore
                    }


                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {

            on: false,
            success: false,
            messages: []

        }
    }
});



const Explore = Vue.component('explore', {
    template: `
    <div class="homediv" v-for="post in posts">
        <div>
            <li><img :src=post.profile_photo/> {{post.username}}</li>
            <li><img :src=post.photo/></li>
            <li>{{post.caption}}</li>
        <div>
        <div>
            <li> <img src="static/images/likes.png"> {{post.likes}} Likes</li>
            <li>{{post.created_on}}</li>
        </div>



    </div>
    `,
    data: function() {
        let self = this;
        return {
            posts = []
        }
    },
    methods: {
        uploadpost: function() {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/posts", {

                    // add headers
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // get all posts
                    self.posts = jsonResponse.posts;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {

            on: false,
            success: false,
            posts: []

        }
    }
});


const Home = Vue.component('home', {
    template: `
  <h1> lol,dwl </h1>
    <div class="homediv">
        <img id="sidepic" src ="/static/images/homepage.png" />
        <div id="logreg">
            <li class="appname"><img class="applogo" src="/static/images/logo.png"/> Photogram</li>
            <li>Share photos of your favourite momemnts with friends,family and the world</li>
            <div id="buttons"><li><button class="btn btn-secondary"> Register</button> <button class="btn btn-primary"> Login</button></li> </div>
        </div>
    
    </div>
   `,
    data: function() {
        return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
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
        { path: "/posts/new", component: New_post },
        // This is a catch all route in case none of the above matches
        { path: "*", component: NotFound }
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});