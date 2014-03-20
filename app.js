
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , socket = require('socket.io')
  , path = require('path');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

io.sockets.on('connection', function(client){
    client.on('join', function(username){
        client.broadcast.emit('newClient', username);
        client.set('username', username);
        storeUser(username);
        messages.forEach(function(data){
            client.emit('message', data); 
        });
        online_users.forEach(function(data){
            client.emit('newClient', data);
        });
    });

    client.on('message', function(message){
        client.get('username', function(err, username){
            if(err) return;
            var data = {message: message, username: username};
            client.broadcast.emit('message', data);
        });
        client.emit('messageSuccess', message);
        client.get('username', function(err, username){
            if(err) return;
            storeMessage(username, message);
            console.log(messages);
        });
    });

    client.on('disconnect', function(){
        client.get('username', function(err, username){
            if(err) return;
            removeUser(username);
            client.broadcast.emit('userDisconnect', username);
        });
    });

    console.log('New client has been connected');
});
var messages=[];
var storeMessage = function(name, data){
    messages.push({username: name, message: data});
    if (messages.length > 10) {
        messages.shift();
    }
}
var online_users=[];
var storeUser = function(username){
    removeUser(username);
    online_users.push(username);
}

var removeUser = function(username){
    var idx = online_users.indexOf(username);
    if (idx != -1) {
        online_users.splice(idx, 1);
    }
}

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
