const Model = require("./Base"),
    crypto = require("crypto");

const UsersModel = {
    modelName: 'users',
    insert: function(data, callback) {
        data.ID = crypto.randomBytes(20).toString('hex');
        this.collection().insert(data, callback || function(){ });
    },
    getOneItem: function(id, callback){
        this.collection().findOne({ID: id}, callback || function () { });
    },
    getOneItemObj: function(data, callback){
        this.collection().findOne(data, callback || function () { });
    },
    update: function(data, callback) {
        this.collection().update({ID: data.ID}, data, callback || function(){ });
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
module.exports = UsersModel;