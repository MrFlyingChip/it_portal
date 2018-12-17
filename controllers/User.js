const BaseController = require("./Base"),
    model = (require("../models/UserModel"));

module.exports = BaseController.extend({
    name: "User",
    modelName: "users",
    content: null,
    authorize: function(req, res, next) {
        model.setDB(req.db);
        model.logIn(req.body, req.body.session)
            .then(value => {
                req.session.username = value.username;
                req.session.role = value.role;
                req.session.save();
                res.redirect('/');
            })
            .catch(error => {
                console.log(error);
                BaseController.render(req, res, error);
            });
    },
    signUp: function (req, res, next) {
        model.setDB(req.db);
        model.signUp(req.body)
            .then(value => {
                req.session.username = value.username;
                req.session.role = value.role;
                req.session.save();
                res.redirect('/');
            })
            .catch(error => {
                console.log(error);
                BaseController.render(req, res, error);
            })
    }
});