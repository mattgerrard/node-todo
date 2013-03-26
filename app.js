var ss = require('socketstream');
express = require('express');

var app = express();

// mongoose setup
require( './db' );

// move routes before middlewares
var routes = require('./routes');

// Configuration
// add cookieParser and currentUser to middlewares
app.configure( function () {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(routes.current_user);
  app.use(app.router);
  app.use(express.favicon());
});

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css: 'libs/reset.css',
  code: ['libs/jquery.min.js', 'libs/knockout.js', 'app'],
});

// Use Express to route requests
app.get('/', function(req, res) {
  res.serveClient('main');
});
app.get('/list', routes.list);
app.post('/save', routes.save);

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

server = app.listen(3000);
ss.start(server);

// Append SocketStream middleware to the stack
app.stack = ss.http.middleware.stack.concat(app.stack);
