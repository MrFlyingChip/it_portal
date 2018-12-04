const Model = require("./Base"),
    crypto = require("crypto"),
    model = new Model();
const PagesModel = model.extend({
    insert: function(data, callback) {
        data.ID = crypto.randomBytes(20).toString('hex');
        this.collection().insert(data, callback || function(){ });
    },
    getOneItem: function(id, callback){
        this.collection().findOne({ID: id}, callback || function () { });
    },
    update: function(data, callback) {
        this.collection().update({ID: data.ID}, data, callback || function(){ });
    },
    remove: function(ID, callback) {
        this.collection().deleteOne({ID: ID}, callback || function(){ });
    }
});
module.exports = PagesModel;