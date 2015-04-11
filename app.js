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
var requestIp = require('request-ip');
var http = require('http');

// create a new express server
var app = express();
var bodyParser     =         require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

function GetCityInformation(CityName, StateName, callback) {
    return http.get({
        host: 'api.sba.gov',
        path: '/geodata/all_links_for_city_of/' + CityName + '/' + StateName + '.json'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback(parsed);
        });
    });

};

app.post('/login',function(req,res){
	var data = req.body.data;
	var ip = requestIp.getClientIp(req);

	if (ip == "127.0.0.1"){
		ip = "184.177.20.169";
	} 

	satelize.satelize({ip:ip}, function(err, geoData){
		var obj = JSON.parse(geoData);
		GetCityInformation( obj.city.replace(' ', '%20'), obj.region_code, function (cityinfo){
			res.end("You're in " + cityinfo[0].full_county_name + " in " + cityinfo[0].state_name);
			//res.end(JSON.stringify(cityinfo));
		});

	});
});

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

