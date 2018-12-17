const Model = require("./Base"),
    crypto = require("crypto");

const PagesModel = {
    modelName: 'pages',
    startPages: {'Account' : {pageType: 'accountPage', title: 'Account', pageName: 'Account'},
                    'Home': {pageName: 'Home', pageType: "container"},
                    'Login': {pageType: 'loginPage', title: 'Login', pageName: 'Login'},
                    'Update': {pageType: 'updatePage', title: 'Update', pageName: 'Update'}},
    insert: function(data) {
        data.ID = crypto.randomBytes(20).toString('hex');
        return this.collection().insertOne(data);
    },
    getOneItem: function(data){
        return this.collection().findOne(data);
    },
    update: function(data) {
        return this.collection().updateOne({ID: data.ID});
    },
    getlist: function(query) {
        return this.collection().find(query || {}).toArray();
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
    checkForStartPage: function (pageName) {
        return new Promise((resolve, reject) => {
            this.getOneItem({pageName: pageName})
                .next(value => {
                    if(!value){
                        const page = this.startPages[pageName];
                        return this.insert(page);
                    } else {
                        resolve(value);
                    }
                })
                .next(value => {
                    resolve(value.ops[0]);
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    renderAccountPage: function (cookie) {
        return new Promise((resolve, reject) => {
            if(!cookie || !cookie.username){
                reject();
            }

            let page = {};
            this.checkForStartPage('Home')
                .then(value => {
                    return this.checkForStartPage('Account')
                })
                .then(value => {
                    page = value;
                    return this.getlist({ created: cookie.username });
                })
                .then(value => {
                    page.children = value;
                    resolve(page);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },
    renderLoginPage: function (cookie) {
        return new Promise((resolve, reject) => {
            if(cookie && cookie.username){
                reject();
            }

            this.checkForStartPage('Home')
                .then(value => {
                    return this.checkForStartPage('Login')
                })
                .then(value => {
                    resolve(value);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },
    deletePage: function (pageID, cookie) {
        return new Promise((resolve, reject) => {
            if(!cookie || !cookie.username || !pageID){
                reject();
            }

            this.getOneItem({ID: pageID})
                .then(value => {
                    if(value.creator !== cookie.username || cookie.role !== 'ADMIN'){
                        reject();
                    } else {
                        return this.remove(pageID);
                    }
                })
                .then(value => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    renderUpdatePage: function (pageID) {
        return new Promise((resolve, reject) => {
            let page = {};
            this.checkForStartPage('Home')
                .then(value => {
                    return  this.getOneItem({ID: pageID});
                })
                .then(value => {
                    if(!value){
                        reject();
                    } else {
                        page = value;
                        return this.checkForStartPage('Update');
                    }
                })
                .then(value => {
                    page.title = value;
                    page.pageType = value;
                    return this.getlist({pageType: 'container'});
                })
                .then(value => {
                    page.containers = value;
                    resolve(page);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }
};
module.exports = PagesModel;