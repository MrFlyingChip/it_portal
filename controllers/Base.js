const _ = require("underscore"),
    View = require("../views/Base"),
    model = (require("../models/PagesModel"));

module.exports = {
    name: "base",
    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {

    },
    isAuth: function(req){
        if(req.session &&
            req.session.username &&
            req.session.role){
            return true;
        }

        return false;
    },
    render: function (req, res, content) {
        model.setDB(req.db);
        let self = this;
        model.getOneItem({pageName: 'Home'}, function (err, rootPage) {
            model.getlist(function(err, records) {
                if(self.isAuth(req)){
                    content.auth = true;
                    content.role = req.session.role;
                    content.username = req.session.username;
                } else {
                    content.auth = false;
                }
                content.childPages = records;
                let v = new View(res, content.pageType);
                v.render(content);
            }, { parentID: rootPage.ID });
        });
    }
};