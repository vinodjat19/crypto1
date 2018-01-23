module.exports = function(app) {

	var db = require('./models/db')
	var express = require('express')
  , router = express.Router()

  	var AlphaVantageAPI = require('alpha-vantage-cli').AlphaVantageAPI;

	var yourApiKey = '3H8WJKLVRPTOU92F';
	var interval = '1min'
	var alphaVantageAPI = new AlphaVantageAPI(yourApiKey,'compact', true);

	app.get('/getData', function(req, res) {
		alphaVantageAPI.getDailyData('MSFT',interval,type='intraday')
	    .then(dailyData => {
	        // console.log("Daily data:");
	    	res.send({docs: dailyData, success : true});

	    })
	    .catch(err => {
	        // console.error(err);
	    });
	})

	app.get('/getNames', function(req, res) {
		
	  var collection = db.getCollection('names')

	  collection.find().toArray(function(err, docs) {
	  		res.send({docs: docs, success : true});
	  })
	})

	app.post('/getDataByName', function(req, res) {
		var name = req.body.name;
		alphaVantageAPI.getDailyData(name,interval)
	    .then(dailyData => {
	        console.log("Daily data:");
	    	res.send({docs: dailyData, success : true})

	    })
	    .catch(err => {
	        console.error(err);
	    });
	})

	app.post('/saveDataManual', function(req, res) {
		
		var data = req.body;
	  	var collection = db.getCollection('names')
  		
  		collection.insert(data, function(err, result) {
			if(err) {
				res.send({success: false})
			}  else {
				res.send({success: true})
			}
		 })
	  	
	})


	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};