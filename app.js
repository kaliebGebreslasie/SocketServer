var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8000);
io.set("origins", "*:*");

var currentPrice = 99;

io.on('connection', function (socket) {
    socket.emit('priceUpdate',currentPrice);
    socket.on('bid', function (data) {
      console.log("data"+data);
        currentPrice = parseInt(data);
        socket.emit('priceUpdate',currentPrice);

        socket.broadcast.emit('priceUpdate',currentPrice);
    });
     socket.on('msg', function (data) {
      console.log("data"+data);
      //  data=data+1;
      data["status"]="delivered";
        socket.emit('msg',data);
        socket.broadcast.emit('msg',data);
    });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;