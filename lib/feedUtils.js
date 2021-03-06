var realtime = require('rtd-realtime');
var _ = require('lodash');
var csv = require('csv');
var fs = require('fs');
var UNION_STATION_STOP_ID = '33727';
var UNION_STATION_STOPS = {};
var UNION_STATION_TRIPS = {};

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
	},
	loadUnionStationData: function(callback) {
		var stops = [];
		var oneStopPer = {};

		var parser = csv.parse({columns: true}, function(err, data){
			stops = _.filter(data, function(row){ 
				return row.parent_station === UNION_STATION_STOP_ID || row.stop_id === UNION_STATION_STOP_ID;
			});

			UNION_STATION_STOPS = _.keyBy(stops, 'stop_id');
			loadTripData(callback);
		});

		fs.createReadStream(__dirname+'/../resources/stops.txt').pipe(parser);
	}
}

var matchWithCSVData = function(feedData) {
	var byRoute = {};

	// Big O? What's that?
	// Also his would be better chained
	_.each(UNION_STATION_STOPS, function(current_stop) {
		var filteredData = _.filter(feedData, function(trip) {
			var nextStop = _.find(trip.trip_update.stop_time_update, {stop_sequence: 1});
			return nextStop && nextStop.stop_id === current_stop.stop_id;
		});
		
		// mutating data is not functional, I'm fired
		var justTheStationWeWant = _.each(filteredData, function(trippin) {
			trippin.trip_update.stop_time_update = _.find(trippin.trip_update.stop_time_update, {stop_id: current_stop.stop_id});
			trippin.trip_update.trip.stop_id_name = current_stop.stop_name;
			trippin.trip_update.trip.headsign = UNION_STATION_TRIPS[trippin.trip_update.trip.trip_id].trip_headsign;

			var routeMapId = trippin.trip_update.trip.route_id + trippin.trip_update.trip.direction_id;
			if(byRoute[routeMapId] && trippin.trip_update.stop_time_update.departure && trippin.trip_update.stop_time_update.departure.time.low < byRoute[routeMapId].trip_update.stop_time_update.departure.time.low) {
				byRoute[routeMapId] = trippin;
			} else if(trippin.trip_update.stop_time_update.departure && _.isNil(byRoute[routeMapId])) {
				byRoute[routeMapId] = trippin;
			}
		});
	});

	return _.values(byRoute);
}

var loadTripData = function(callback) {
	var stops = [];

	var parser = csv.parse({columns: true}, function(err, data){
		UNION_STATION_TRIPS = _.keyBy(data, 'trip_id');
		callback("done");

	});

	fs.createReadStream(__dirname+'/../resources/trips.txt').pipe(parser);
}