const Model = require("./Base"),
    crypto = require("crypto"),
    model = new Model();
const PagesModel = model.extend({
    insert: function(data, callback) {
        data.ID = crypto.randomBytes(20).toString('hex');
        this.collection().insert(data, callback || function(){ });
    },
    getOneItemID: function(id, callback){
        this.collection().findOne({ID: id}, callback || function () { });
    },
    getOneItemName: function(name, callback){
        this.collection().findOne({pageName: name}, callback || function () { });
    },
    update: function(data, callback) {
        this.collection().update({ID: data.ID}, data, callback || function(){ });
    },
    getlist: function(callback, query) {
        this.collection().find(query || {}).toArray(callback || function(){ });
    },
    remove: function(ID, callback) {
        this.collection().deleteOne({ID: ID}, callback || function(){ });
    }
});
module.exports = PagesModel;