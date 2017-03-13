var FeedData = require('./lib/feedUtils.js')

var getUnionStationVehicles = [];

FeedData.getUnionStationVehicles(function(err, data) {

	if(err) {
		console.log("Problem getting data: " + err);
	} else {
		//console.log("trip data length: " + data.length)
		console.log("Here is some data for a station:" + JSON.stringify(data));
		console.log("~~~~~~~~~LEAVING UNION STATION~~~~~~~~~~~~~~")
		data.forEach(function(aTrip) {
			console.log("Route " + aTrip.trip_update.trip.route_id + " to " + aTrip. + " at " + );
		});
	}
});
