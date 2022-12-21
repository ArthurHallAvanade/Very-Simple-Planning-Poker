const port = process.env.PORT 
const fayeport = process.env.PORT 

/* var http = require('http'),
    faye = require('faye');

var fayeServer = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

console.log("it worked");
bayeux.attach(fayeServer);
fayeServer.listen(fayeport);


var connect = require('connect');
var serveStatic = require('serve-static');

connect()
    .use(serveStatic(__dirname))
    .listen(port, () => console.log('Server Running.')); */

var express = require('express');
var app = express();

//setting middleware
app.use(express.static(__dirname + 'public')); //Serves resources from public folder


var server = app.listen(port);

faye = require('faye');

bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

console.log("it worked");
bayeux.attach(server);
