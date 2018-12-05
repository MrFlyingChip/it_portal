const _ = require("underscore"),
    View = require("../views/Base");

module.exports = {
    name: "base",
    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {

    },
    render: function (res, content) {
        const self = this;
        let v = new View(res, content.pageType);
        v.render(content);
    }
};