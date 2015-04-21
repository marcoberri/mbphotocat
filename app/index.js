var conf = require('./conf.js');
var express = require('express');
var compression = require('compression');
var session = require('express-session');
var morgan = require('morgan');
var fs = require('fs');
var responseTime = require('response-time');
var app = express();
var monk = require('monk');



var controllerImage = require('./controller/image');


//monk per mongo
var db = monk(conf.MONGO);

app.use(function(req,res,next){
    req.db = db;
    next();
});

//express response time
app.use(responseTime())

// express compress all requests
app.use(compression());

//express static folder
app.use(express.static('public'));

//express session
app.use(session({
  secret: 'keyboard cat',
    resave: false,
      saveUninitialized: true
}));


//logger
var accessLogStream = fs.createWriteStream(conf.ACCESS_LOG, {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));


/*
//all request logging
app.all('/*', function (req, res, next) {
    console.log('Accessing path: ' + req.path);
    console.log('Cluster:' + process.pid);
    next(); 
});
    
app.get('/', function (req, res) {
    var n = req.session.views || 0;
    req.session.views = ++n;
    var text = "Start page";
    text +="\n tot view:" + n;
    res.send(text);
  
 });
*/

var router = express.Router();


//a middleware with no mount path, gets executed for every request to the router
router.use(function (req, res, next) {
	console.log('Accessing path: ' + req.path);
    console.log('Cluster:' + process.pid);
    next(); 
});


router.post('/image/save', function (req, res) {
	
	controllerImage.save(req,res, function(err){
		res.send('Got a PUT request at /user');
		}
	 );
	  
	});


// Handle Error
router.use(function(req, res) {
     res.status(404).send('404: Page not Found');
});


app.use('/', router);




var server = app.listen(conf.PORT, function () {
  
  var host = server.address().address;
  var port = server.address().port;
      
 console.log('listen at http://%s:%s', host, port);
     
});