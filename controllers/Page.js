const BaseController = require("./Base"),
    model = new (require("../models/PagesModel"));

module.exports = BaseController.extend({
    name: "Page",
    content: null,
    run: function(req, res, next, db) {
        model.setDB(req.db);
        model.setModelName('pages');
        let self = this;
        this.checkForRootPage(() => {
            this.getContent(req.params['id'], function() {
                BaseController.render(res, self.content);
            });
        });
    },
    checkForRootPage: function(callback){
        model.getOneItemName('root', function (err, rootPage) {
            if(!rootPage){
                model.insert({pageName: 'root'}, callback);
            }
            callback();
        });
    },
    getContent: function(pageID, callback) {
        let self = this;
        this.content = {};
        model.getOneItemID(pageID, function (error, page) {
            if(page === null){
                callback();
            } else if(page.type === 'container'){
               model.getlist(function(err, records) {
                   self.content = {page: page, children: records};
                   callback();
               }, { parentID: pageID });
           } else if(page.type === 'page'){
               self.content = {page: page};
           }
        });

    }
});