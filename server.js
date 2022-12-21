const port = process.env.PORT 
const fayeport = process.env.PORT 


var express = require('express');
var app = express();

//setting middleware
app.use(express.static(__dirname + 'public')); //Serves resources from public folder


var server = app.listen(port);

faye = require('faye');

bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

console.log("it worked");
bayeux.attach(server);
