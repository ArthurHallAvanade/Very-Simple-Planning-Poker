var http = require('http'),
    faye = require('faye');

var fayeServer = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

console.log("it worked");
bayeux.attach(fayeServer);
fayeServer.listen(8000);


var connect = require('connect');
var serveStatic = require('serve-static');

connect()
    .use(serveStatic(__dirname))
    .listen(8080, () => console.log('Server running on 8080...'));
