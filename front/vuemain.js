const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
        var app = new Vue({
            el: "#app",
            data: {
                info: null, 
                name: null,
                projects: []
            },
            methods: {
                  addProject: function(event){
                      if(!this.name) return 
                      const params = new URLSearchParams();
                      params.append('name', this.name);
                      axios
                      .post('/addproject', params, config).then(response => {
                          this.projects = response.data
                          this.name = null
                      }).catch(function (error) {
                           console.log(error);
                      });
                  },
                  deleteProject: function (id) {
                      const params = new URLSearchParams();
                      params.append('id', id);
                      axios
                      .post('/deleteproject', params, config)
                      .then(response => this.projects = response.data)
                      .catch(error => console.log(error));
                  },
                  loadProjects: function(){
                    axios
                    .get('/projects')
                    .then(response => (this.projects = response.data));
                  }
            },
          created: function(){
             this.loadProjects()
          }
        })  