const UserController = require('../controllers/User');

module.exports = function (app, upload, attachDB) {
    app.post('/login', attachDB, function (req, res, next) {
        UserController.authorize(req, res, next);
    });
    app.post('/sighup', attachDB, function (req, res, next) {
        UserController.signUp(req, res, next);
    });
    app.get('/logout', attachDB, function (req, res) {
        req.session.destroy();
        res.redirect('/');
    });
};