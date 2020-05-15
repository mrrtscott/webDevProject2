/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div>
        <img>  
        <a class="navbar-brand appname" href="#">Photogram</a>
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
    <div class="maindiv">
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
                    <label for ="lastname">lastname</label>
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
                        <textarea  name="biography" id="biography" rows="4" cols="60" coclass="form-control"/>
                    </div>
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
                    console.log(jsonResponse.errors);
                    if (jsonResponse.message == "User successfully registered") {
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
    <div class="maindiv">
        <div class="login">
            <form @submit.prevent="login" enctype="multipart/form-data" id="loginForm">

                <div class="form-group">
                    <label for ="username">Username</label>
                    <input type="text" name="username" id="username" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" class="form-control"/>
                </div>

                <div class="login_button">
                    <button type="submit" name="login" class="btn btn-success">Login</button>
                </div>

            </form>
        </div>   
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
                        'X-CSRFToken': token
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    console.log(jsonResponse.errors);
                    if (jsonResponse.message == "User successfully logged in") {
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
    <div class="userprofilediv">
        <div id="userheader">
            <img class="profilephoto" v-bind:src="'../static/uploads/' + photo"/>
            <div id="middle">
                <ul>
                    <li id="firstname" class="firstname">{{firstname}} {{lastname}}</li>
                    <li id="locationli">{{location}}</li>
                    <li>Member since {{joined_on}}</li>
                    <li id="biographyli"> {{biography}}</li>
                </ul>

                
            </div>
            <div id="followers">
              <div id="row1">
                    <li class="post_num">6</li>
                    <li class="followers_num">10</li>
                    <li>Posts</li>
                    <li >Followers</li>
               
               
              </div>
              <div class="follow_button">
                <button id="followbtn" class="btn btn-primary"> Follow</button>
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
        // fetch("/api/users/" + self.id + "/post")
        fetch("/api/users/" + self.id + "/posts")
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
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

                // router.push('login');

            })
            .catch(function(error) {
                console.log(error);
            });
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
            photo: ""

        }
    }
});


const Newpost = Vue.component('newpost', {
    template: `
    <div class="maindiv">
       
        <form @submit.prevent="uploadpost" enctype="multipart/form-data" id="uploadForm">
       
        <div class="form-group">
            <label for="photo">Photo</label>
            <input name="photo" id="photo" type="file">
        </div>

        <div class="form-group">
            <label for="caption">Caption</label>
            <textarea class="form-control" name="caption" id="caption" placeholder="Enter description here"></textarea>
        </div>

        <div class="register_button">
            <button type="submit" name="upload" class="btn btn-success">Upload</button>
        </div>

    </form>
    </div>
    `,
    methods: {
        uploadpost: function() {
            self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/users/" + self.id + "/posts", {

                    method: 'POST',
                    body: form_data,
                    headers: {
                        'X-CSRFToken': token
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
                        router.push('explore');
                    }



                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    data: function() {
        return {
            id: 8,
            messages: ""

        }
    }
});



const Explore = Vue.component('explore', {
    template: `
    <div id="explore_main">
        <br><br><br>
        
        <div class= newpost_button>
         <button v-on:click="createpost"> New Post</button>
        </div>

        
        <div class="homediv" v-for="post in posts">
            <div class="card" id="cardlay">
                <div>
                    <li><img class="userprofilephoto" v-bind:src="'../static/uploads/' + post.profile_photo"/> {{post.username}}</li>
                    <li><img class="postphoto" v-bind:src="'../static/uploads/' + post.photo"/></li>
                    <li>{{post.caption}}</li>
                </div>
                <div id="likendate">
                    <li> <i class="fa fa-heart-o" aria-hidden="true"></i>  <i class="fa fa-heart" aria-hidden="true"></i>{{post.likes}} Likes</li>
                    <li>{{post.created_on}}</li>
                </div>
            </div>
            
        </div>
    </div>
    `,
    created: function() {
        let self = this;
        // fetch("/api/users/" + self.id + "/post")
        fetch("/api/posts")
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log(jsonResponse);
                // self.message=data.message
                self.posts = jsonResponse.posts;
                self.username = jsonResponse.username;
                self.photo = jsonResponse.photo;

                // router.push('login');

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
            photo: ""
        }
    },
    methods: {
        createpost: function(event) {

            router.push('/posts/new');

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

            router.push('register');

        },
        login: function(event) {
            router.push('login');
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
        fetch('/api/auth/logout')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                // self.message=data.message
                router.push('login');

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