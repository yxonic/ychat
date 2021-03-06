var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var faye = require('faye');

var routes = require('./routes/index');

var app = express();
var server = http.createServer(app);
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
switch(app.get('env')){
case 'development':
    mongoose.connect('mongodb://localhost/ychat-testing', opts);
    break;
case 'production':
    mongoose.connect('mongodb://localhost/ychat', opts);
    break;
default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}
var Msg = require('./models/msg.js')

bayeux.on('publish', function(clientId, channel, data) {
    if (channel == '/faye/commands') return;
    var msg = Msg(data.model);
    if (msg.uid) {
        msg.save(function (err) {
        });
    }
})

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

bayeux.attach(server);

module.exports = {app: app, server: server, db: Msg};
