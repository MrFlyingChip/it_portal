const express = require('express'),
    path = require('path'),
    config = require('./config')(),
    app = express(),
    MongoClient = require('mongodb').MongoClient,
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorhandler = require('errorhandler'),
    PageController = require('./controllers/Page'),
    routes = require('./routes');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
// all environments
// app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/templates');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('it-portal'));
app.use(session());
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(errorhandler());
}

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '', function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        const attachDB = function(req, res, next) {
            req.db = db.db('it_portal');
            next();
        };
        app.get('/404', attachDB, function (req, res) {
            res.redirect('/');
        });
        routes(app, upload, attachDB);
        app.get('/login', attachDB, function (req, res) {
            PageController.loginPage(req, res);
        });
        app.get('/account', attachDB, function (req, res) {
            PageController.accountPage(req, res);
        });
        app.get('/:id/add', attachDB, function(req, res, next) {
            PageController.addPage(req, res, next, false);
        });
        app.post('/:id/add', upload.single('pageImage'), attachDB, function(req, res, next) {
            PageController.addPage(req, res, next, true);
        });
        app.get('/:id/update', attachDB, function(req, res, next) {
            PageController.updatePage(req, res, next, false);
        });
        app.post('/:id/update', upload.single('pageImage'), attachDB, function(req, res, next) {
            PageController.updatePage(req, res, next, true);
        });
        app.post('/:root/delete/:id', attachDB, function(req, res, next) {
            PageController.deletePage(req, res, next);
        });
        app.get('/admin/:id', attachDB, function (req, res, next) {
            PageController.run(req, res, next, false, true);
        });
        app.get('/admin', attachDB, function (req, res, next) {
            PageController.run(req, res, next, true, true);
        });
        app.get('/:id', attachDB, function(req, res, next) {
            PageController.run(req, res, next, false, false);
        });
        app.get('/', attachDB, function(req, res, next) {
            PageController.run(req, res, next, true, false);
        });
        app.get('*', attachDB, function(req, res, next) {
            PageController.run(req, res, next, false, false);
        });
        app.listen(config.port, function() {
            console.log(
                'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
                '\nExpress server listening on port ' + config.port
            );
        });
    }
});