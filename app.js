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
var hardcode_data = require('./hardcode_data');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Connection URL
var MongoUrl = 'mongodb://localhost:27017/myproject';
var WaterDataCollection = "WaterDataCollection";
// Use connect method to connect to the Server
MongoClient.connect(MongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.close();
});

var WaterSupplyDemandDataLib = require('./WaterSupplyDemandData'); 
var WaterSupplyDemandData = WaterSupplyDemandDataLib.WaterSupplyDemandData;

// create a new express server
var app = express();
var bodyParser     =         require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//--------------------------------------------------
// Functions definitions
//--------------------------------------------------
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
            callback(parsed, StateName);
        });
    });
};

function getWaterDataByStateCounty(StateAbbr, County){
	for (var i  = 0; i < WaterSupplyDemandData.length; i++){
		if (WaterSupplyDemandData[i].StateAbbr == StateAbbr && WaterSupplyDemandData[i].County == County){
			return WaterSupplyDemandData[i];
		}

	}
	return null;
}

function getCountyList(StateAbbr, callback){
    return http.get({
        host: 'api.sba.gov',
        path: '/geodata/county_links_for_state_of/' + StateAbbr + '.json'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
			var processed = parsed.map(function(array_elem){
				return array_elem.name;
			});	
            callback(processed);
        });
    });
}

//var clearDocuments = function(){
//    MongoClient.connect(MongoUrl, function(err, db) {
//        var collection = db.collection(WaterDataCollection);
//        collection.remove({});
//        db.close();
//    });
//}

var initializeAllWaterData = function(Wather) {
	MongoClient.connect(MongoUrl, function(err, db) {
		var collection = db.collection(WaterDataCollection);
		//clear old data
		collection.remove({});
		collection.insert(WaterSupplyDemandData);
		db.close();
	});
  //// Get the documents collection
  //var collection = db.collection(WaterDataCollection);
  //// Insert some documents
  //collection.insert([
  //  {a : 1}, {a : 2}, {a : 3}
  //], function(err, result) {
  //  assert.equal(err, null);
  //  assert.equal(3, result.result.n);
  //  assert.equal(3, result.ops.length);
  //  console.log("Inserted 3 documents into the document collection");
  //  callback(result);
  //});
}
//--------------------------------------------------
// Routes allowed in this app
//--------------------------------------------------
//app.post('/login',function(req,res){
//    var data = req.body.data;
//    var ip = requestIp.getClientIp(req);

//    if (ip == "127.0.0.1"){
//        ip = "184.177.20.169";
//    } 

//    satelize.satelize({ip:ip}, function(err, geoData){
//        var obj = JSON.parse(geoData);
//        GetCityInformation( obj.city.replace(' ', '%20'), obj.region_code, function (cityinfo){
//            res.end("You're in " + cityinfo[0].full_county_name + " in " + cityinfo[0].state_name);
//            //res.end(JSON.stringify(cityinfo));
//        });

//    });
//});

app.get('/ajaxget', function(req, res){
	console.log('ajaxget: ' + JSON.stringify(req.query));
	var data = req.query;
	if (data.functionName == 'getStateList'){
		res.end(JSON.stringify({
			"StateList": hardcode_data.StateList
		}));
	} else if (data.functionName == 'getCountyList'){
		var StateAbbr = data.abbreviation;
		getCountyList(StateAbbr, function(data){
			res.end(JSON.stringify({
				"CountyList": data 
			}));
		});
	} else if (data.functionName == 'getCurrentLocation'){
		var data = req.body.data;
		var ip = requestIp.getClientIp(req);

		if (ip == "127.0.0.1"){
			ip = "184.177.20.169";
		} 

		satelize.satelize({ip:ip}, function(err, geoData){
			var obj = JSON.parse(geoData);
			GetCityInformation( obj.city.replace(' ', '%20'), obj.region_code, function (cityinfo,StateAbbr){
				res.end(JSON.stringify({
					"County": cityinfo[0].full_county_name,
					"State": cityinfo[0].state_name,
					"StateAbbr": StateAbbr
					}));
				//res.end(JSON.stringify(cityinfo));
			});

		});
	} else if (data.functionName == 'getWaterData'){
		var lookup_result = getWaterDataByStateCounty(data.StateAbbr, data.County);
		if (lookup_result == null){ 
			res.send(500, {'error': "Can't find info for this state and county"});
		} else {
			res.end(JSON.stringify(lookup_result));
		}
	}
});

//--------------------------------------------------
// Main function
//--------------------------------------------------
initializeAllWaterData();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

