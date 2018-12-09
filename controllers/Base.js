const _ = require("underscore"),
    View = require("../views/Base");
    model = new (require("../models/PagesModel"));

module.exports = {
    name: "base",
    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {

    },
    render: function (req, res, content) {
        model.setDB(req.db);
        model.getOneItemName('root', function (err, rootPage) {
            model.getlist(function(err, records) {
                content.rootPages = records;
                let v = new View(res, content.pageType);
                v.render(content);
            }, { parentID: rootPage.ID });
        });
    }
};