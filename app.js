/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');
var satelize = require('satelize');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

//satelize.satelize({ip:'46.19.37.108'}, function(err, geoData){
//    var obj = JSON.parse(geoData);
//});

// create a new express server
var app = express();
var bodyParser     =         require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.post('/login',function(req,res){
	var data = req.body.data;
	console.log("data = " + data);
	res.end("good");
  //var user_name=req.body.user;
  //var password=req.body.password;
  //console.log("User name = "+user_name+", password is "+password);
  //res.end("yes");
});

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

//var ip = req.headers['x-forwarded-for'] || 
//     req.connection.remoteAddress || 
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;
