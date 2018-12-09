const BaseController = require("./Base"),
    model = new (require("../models/UserModel"));

module.exports = BaseController.extend({
    name: "User",
    content: null,
    authorize: function(req, res, callback) {
        if(req.session &&
            req.session.it_portal &&
            req.session.it_portal === true){
            callback(req, res);
        }
        model.setDB(req.db);
        if(req.body){
            model.getOneItemName(req.body.username, function (err, user) {
                if(user && user.password === req.body.password){
                    callback(req, res);
                } else {

                }
            })
        }
    },
    signUp: function (req, res, callback) {
        model.setDB(req.db);
        model.getOneItemName(req.body.username, function (err, user) {
            if(user){

            } else {

            }
        })
    }
});