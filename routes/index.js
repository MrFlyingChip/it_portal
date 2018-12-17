const user = require('./user');

module.exports = function (app, upload, attachDB) {
    user(app, upload, attachDB);
};