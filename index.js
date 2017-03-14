var FeedData = require('./lib/feedUtils.js')

var getUnionStationVehicles = [];

FeedData.loadUnionStationData(function(cb) {
	console.log("Stop/trip data loaded");
	FeedData.getUnionStationVehicles(function(err, data) {
		if(err) {
			console.log("Problem getting data: " + err);
		} else {
			console.log("~~~~~~~~~LEAVING UNION STATION~~~~~~~~~~~~~~")
			data.forEach(function(aTrip) {
				if(aTrip.trip_update.stop_time_update.departure && aTrip.trip_update.stop_time_update.departure.time.low) {
					//console.log(" A TRIP: ");
					//console.log(JSON.stringify(aTrip));
					var displayDate = new Date(aTrip.trip_update.stop_time_update.departure.time.low * 1000);
					console.log("Route " + aTrip.trip_update.trip.route_id + 
					" leaving from " + aTrip.trip_update.trip.stop_id_name + " toward " + aTrip.trip_update.trip.headsign + " at " + displayDate.toTimeString());
				}
			});
		}
	});
});
