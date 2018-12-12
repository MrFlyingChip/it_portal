const BaseController = require("./Base"),
    model = (require("../models/UserModel"));

module.exports = BaseController.extend({
    name: "User",
    modelName: "users",
    content: null,
    authorize: function(req, res, next) {
        if(req.session &&
            req.session.username &&
            req.session.role){
            res.redirect('/');
        }
        model.setDB(req.db);
        if(req.body){
            model.getOneItemObj({username: req.body.username}, function (err, user) {
                if(user && user.password === req.body.password){
                    req.session.username = user.username;
                    req.session.role = user.role;
                    req.session.save();
                    res.redirect('/');
                } else {
                    const data = {pageType: "loginPage", title:"Login"};
                    if(!user){
                        data.errorLogInUsername = "No such user!";
                    } else if(user.password !== req.body.password){
                        data.errorLogInPassword = "Wrong password";
                    }
                    BaseController.render(req, res, data);
                }
            })
        }
    },
    signUp: function (req, res, next) {
        model.setDB(req.db);
        if(!req.body || !req.body.username || !req.body.password || !req.body.email){
            BaseController.render(req, res, {errorSignUp: "Invalid data!", pageType: "loginPage", title:"Login"});
        }

        model.getOneItemObj({username: req.body.username}, function (err, usernameUser) {
            if(usernameUser){
                BaseController.render(req, res, {errorSignUpUsername: "Username is already used!", pageType: "loginPage", title:"Login"});
            } else {
                model.getOneItemObj({email: req.body.email}, function (err, emailUser) {
                    if(emailUser){
                        BaseController.render(req, res, {errorSignUpEmail: "Email is already used!", pageType: "loginPage", title:"Login"});
                    } else {
                        model.insert({email: req.body.email, password: req.body.password, username: req.body.username, role: "USER"});
                        req.session.username = req.body.username;
                        req.session.role = "USER";
                        req.session.save();
                        res.redirect('/');
                    }
                })
            }
        })
    }
});