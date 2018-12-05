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
    PageController = require('./controllers/Page');


const upload = multer({ dest: 'public/images/' });
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
        app.all('/:id', attachDB, function(req, res, next) {
            PageController.run(req, res, next);
        });
        app.listen(config.port, function() {
            console.log(
                'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
                '\nExpress server listening on port ' + config.port
            );
        });
    }
});