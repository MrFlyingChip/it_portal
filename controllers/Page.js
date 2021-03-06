const BaseController = require("./Base"),
    model = (require("../models/PagesModel"));

module.exports = BaseController.extend({
    name: "Page",
    content: null,
    modelName: "pages",
    run: function(req, res, next, root, admin) {
        model.setDB(req.db);
        let self = this;
        this.checkForRootPage(() => {
            if(admin && root){
                if(!req.session || !req.session.role || req.session.role !== "ADMIN"){
                    res.redirect('/');
                }
                this.getContent({pageName: 'Home'}, function() {
                    if(self.content) self.content.pageType += "Admin";
                    self.content.title = "Admin";
                    BaseController.render(req, res, self.content);
                });
            } else if(admin){
                if(!req.session || !req.session.role || req.session.role !== "ADMIN"){
                    res.redirect('/');
                }
                console.log(req.params['id']);
                this.getContent({ID: req.params['id']}, function() {
                    if(self.content) self.content.pageType += "Admin";
                    self.content.title = "Admin";
                    BaseController.render(req, res, self.content);
                });
            }else if(root && !admin){
                this.getContent({pageName: 'Home'}, function() {
                    self.content.title = self.content.pageName;
                    BaseController.render(req, res, self.content);
                });
            } else {
                this.getContent({ID: req.params['id']}, function() {
                    self.content.title = self.content.pageName;
                    BaseController.render(req, res, self.content);
                });
            }
        });
    },
    getContent: function(obj, callback) {
        let self = this;
        this.content = {};
        model.getOneItem(obj, function (error, page) {
            if(!page){
                callback();
            } else if(page.pageType === 'container'){
               model.getlist(function(err, records) {
                   console.log(obj);
                   self.content = page;
                   self.content.children = records;
                   callback();
               }, { parentID: page.ID });
           } else if(page.pageType === 'page'){
                self.content = page;
                callback();
           } else {
                callback();
            }
        });
    },

    addPage: function (req, res, next, post) {
        model.setDB(req.db);
        let self = this;
        this.checkForRootPage(() => {
           if(post){
                if(!req.body || !req.session || !req.session.username) res.redirect('/');
                const page = req.body;
                page.creator = req.session.username;
                page.date = Date.now();
                page.parentID = req.params['id'];
                page.likes = 0;
                page.pageImage = req.file.originalname;
                model.insert(page, function (err, newPage) {
                    if(req.session.role === "ADMIN"){
                        res.redirect('/admin/' + newPage.ops[0].ID);
                    } else {
                        res.redirect('/' + newPage.ops[0].ID);
                    }
                });
           } else {
               const page = {pageType: 'addPage', title: 'Add Page', parentID: req.params['id']};
               BaseController.render(req, res, page);
           }
        });
    },
    updatePage: function (req, res, next, post) {
        model.setDB(req.db);
        let self = this;
        this.checkForRootPage(() => {
            if(post){
                if(!req.body || !req.session || !req.session.username) res.redirect('/');
                const page = req.body;
                if(req.file){
                    page.pageImage = req.file.originalname;
                }
                page.ID = req.params['id'];
                model.update(page, function (err, newPage) {
                    if(req.session.role === "ADMIN"){
                        res.redirect('/admin/' + page.ID);
                    } else {
                        res.redirect('/' + page.ID);
                    }
                });
            } else {
                model.getOneItem({ID: req.params['id']}, function (error, pageUpd) {
                    if(pageUpd){
                        model.getlist(function(err, records) {
                            pageUpd.pageType = 'updatePage';
                            pageUpd.title = 'Update Page';
                            pageUpd.containers = records;
                            BaseController.render(req, res, pageUpd);
                        }, {ID: pageUpd.parentID});
                    } else {
                        res.redirect('/');
                    }
                });

            }
        });
    },
    renderUpdatePage: function(req, res, next){
        model.setDB(req.db);
        model.renderUpdatePage(req.params['id'])
            .then(value => {
                BaseController.render(req, res, value);
            })
            .catch(error => {
                console.log(error);
                res.redirect('/');
            })
    },

    deletePage: function (req, res, next) {
        model.setDB(req.db);
        model.deletePage(req.params['id'], req.body.session)
            .then(value => {
                if(req.session.role === "ADMIN"){
                    res.redirect('/admin/' + req.params['root']);
                } else {
                    res.redirect('/' + req.params['root']);
                }
            })
            .catch(error => {
                console.log(error);
                res.redirect('/');
            });
    },
    renderLoginPage: function (req, res, next) {
        model.setDB(req.db);
        model.renderLoginPage(req.session)
            .then(value => {
                BaseController.render(req, res, value);
            })
            .catch(error => {
                console.log(error);
                res.redirect('/');
            })
    },
    renderAccountPage: function (req, res, next) {
        model.setDB(req.db);
        model.renderAccountPage(req.session)
            .then(value => {
                BaseController.render(req, res, value);
            })
            .catch(error => {
                console.log(error);
                res.redirect('/');
            })
    },
});