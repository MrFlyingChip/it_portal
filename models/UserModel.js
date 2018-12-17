const Model = require("./Base"),
    crypto = require("crypto");

const UsersModel = {
    modelName: 'users',
    insert: function(data) {
        data.ID = crypto.randomBytes(20).toString('hex');
        return this.collection().insertOne(data);
    },
    getOneItem: function(id){
        return this.collection().findOne({ID: id});
    },
    getOneItemObj: function(data){
        return this.collection().findOne(data);
    },
    update: function(data) {
        return this.collection().update({ID: data.ID}, data);
    },
    remove: function(ID) {
        return this.collection().deleteOne({ID: ID});
    },
    setDB: function(db) {
        this.db = db;
    },
    collection: function() {
        if(this._collection) return this._collection;
        return this._collection = this.db.collection(this.modelName);
    },

    generateErrorObj: function(error){
        error.pageType = "loginPage";
        error.title = "Login";
        return error;
    },

    signUp: function (data) {
      return new Promise((resolve, reject) => {
          if(!data || !data.username || !data.password || !data.email){
              reject(this.generateErrorObj({errorSignUp: "Invalid data!"}));
          }

          this.getOneItemObj({username: data.username})
              .then(value => {
                  if(value){
                      reject(this.generateErrorObj({errorSignUpUsername: "Username is already used!"}));
                  } else {
                      return this.getOneItemObj({email: data.email});
                  }
              })
              .then(value => {
                  if(value){
                      reject(this.generateErrorObj({errorSignUpEmail: "Email is already used!"}));
                  } else {
                      return this.insert({email: data.email, password: data.password, username: data.username, role: "USER"});
                  }
              })
              .then(value => {
                  resolve(value.ops[0]);
              })
              .catch(error => {
                  reject(this.generateErrorObj(error));
              });
          })
    },
    
    logIn: function (data, cookie) {
        return new Promise((resolve, reject) => {
            if(this.checkAuth(cookie)){
                resolve(cookie);
            }

            if(!data || !data.username || !data.password){
                reject(this.generateErrorObj({errorLogIn: "Invalid data!"}));
            }

            this.getOneItemObj({username: data.username})
                .then(value => {
                    if(!value){
                        reject(this.generateErrorObj({errorLogInUsername: "No such user!"}));
                    } else if(value.password !== data.password){
                        reject(this.generateErrorObj({errorLogInPassword: "Wrong password"}));
                    } else {
                        resolve(value);
                    }
                })
                .catch(error => {
                    reject(this.generateErrorObj(error));
                })
        })
    },

    checkAuth: function (cookie){
        return !!(cookie && cookie.username && cookie.role);
    }
};
module.exports = UsersModel;