/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const user_profile = Vue.component('user-profile', {
    template: `
        <div>
            <img/>
            <div>
                firstname last name
                location
                Member since january 2018
                bio
            </div>
            <div>
              <div id="row1>
                only two columns
                post counter
                followers counter
                Posts
                Followers
              </div>
              <button> Follow</button>
            </div>
        </div>
    
    `

})

const upload_form = Vue.component('upload-form', {
    template: `
    <div>
        <form @submit.prevent="uploadPhoto" enctype="multipart/form-data" id="uploadForm">
            <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
                {{message}}
            </div>
            <div class="alert alert-danger" role="alert"  v-if="on && !success" >
                <div v-for="message in messages">
                    <li> {{message}}</li>

                </div>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea class="form-control" name="description" id="description" placeholder="Enter description here"></textarea>
            </div>
            <div class="form-group">
                <label for="photo">Photo</label>
                <input name="photo" id="photo" type="file">
            </div>
             <button type=submit class="btn btn-primary" > Submit </button>
        </form>
    </div>
    `,
    methods: {
        uploadPhoto: function() {
            self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/upload", {

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
})

const Home = Vue.component('home', {
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
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
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: "/", component: Home },
        // Put other routes here
        { path: "/upload", component: upload_form },
        // This is a catch all route in case none of the above matches
        { path: "*", component: NotFound }
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});