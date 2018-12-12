const Model = require("./Base"),
    crypto = require("crypto");

const PagesModel = {
    modelName: 'pages',
    insert: function(data, callback) {
        data.ID = crypto.randomBytes(20).toString('hex');
        this.collection().insertOne(data, callback || function(){ });
    },
    getOneItem: function(data, callback){
        this.collection().findOne(data, callback || function () { });
    },
    update: function(data, callback) {
        this.collection().update({ID: data.ID}, data, callback || function(){ });
    },
    getlist: function(callback, query) {
        this.collection().find(query || {}).toArray(callback || function(){ });
    },
    remove: function(ID, callback) {
        this.collection().deleteOne({ID: ID}, callback || function(){ });
    },
    setDB: function(db) {
        this.db = db;
    },
    collection: function() {
        if(this._collection) return this._collection;
        return this._collection = this.db.collection(this.modelName);
    }
};
module.exports = PagesModel;