const BaseController = require("./Base"),
    View = require("../views/Base"),
    model = new (require("../models/PagesModel"));

module.exports = BaseController.extend({
    name: "Page",
    content: null,
    run: function(req, res, next) {
        model.setDB(req.db);
        model.setModelName('pages');
        let self = this;
        this.getContent(req.params['id'], function() {
            let v = new View(res, 'inner');
            v.render(self.content);
        });
    },
    getContent: function(parentID, callback) {
        let self = this;
        this.content = {};
        model.getlist(function(err, records) {
            self.content = records;
            callback();
        }, { parentID: parentID });
    }
});