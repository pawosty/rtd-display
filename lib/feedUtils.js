var realtime = require('rtd-realtime');
var _ = require('lodash');
//var csv = require('csv');
var UNION_STATION_STOP_ID = '33727';
var UNION_STATION_STOPS = [];

module.exports = {

	getUnionStationVehicles: function(callback) {
		var realtimeData ={};
		realtime.TripUpdates.load(function(err, feedData) {

			if(err) {
				callback(err, null);
			} else {
				realtimeData = feedData.entity;
				callback(null, matchWithCSVData(realtimeData));
			}
		});
	}
}

var matchWithCSVData = function(feedData) {
	var filteredData = _.filter(feedData, function(trip) { return _.some(trip.trip_update.stop_time_update, {stop_id: '34323'})});
	
	// mutating data is not functional, I'm fired
	var justTheStationWeWant = _.each(filteredData, function(trippin) { 
		trippin.trip_update.trip.stop_id_name = "Union Station Gate B4"; 
		trippin.trip_update.trip.headsign = "Highlands Ranch"; 
		trippin.trip_update.stop_time_update = _.filter(trippin.trip_update.stop_time_update, {stop_id: '34323'})
	});
	
	return justTheStationWeWant;
}

var getUnionStationStops = function() {
	var stops = [];
	var csvData = [];
	return stops;
}

var getTripDetails = function() {
	// load csv
	// load in a map I gues??
	// 1.2 mb file which isn't great
}