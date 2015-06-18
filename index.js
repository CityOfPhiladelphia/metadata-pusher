var request = require('request'),
	_ = require('underscore'),
	fs = require('fs'),
	mapFields = require('./util/map-fields.js'),
	config = {
		datasets: require('./config/datasets.js'),
		distributions: require('./config/distributions.js')
	};

var datajson = {
  conformsTo: 'https://project-open-data.cio.gov/v1.1/schema',
  dataset: []
};

// Fetch sources
var mappedSources = {}, pendingRequests = 0;
for(var key in config) {
	pendingRequests++;
	request({
		url: config[key].source,
		json: true
	}, (function(key) { // yay fun javascript scoping stuff
		return function(err, response, body) {
			// If config provides a parse function, run the source through it
			var records = config[key].parse ? config[key].parse(body) : body;
			mappedSources[key] = mapFields(records, config[key].fields);

			// Check if all sources have been fetched and merge the data
			pendingRequests--;
			if( ! pendingRequests) mergeData();
		};
	})(key));
}

// Called when all sources have been fetched
var mergeData = function() {
	// Group endpoints by their dataset id
	var groupedEndpoints = _.groupBy(mappedSources.distributions, 'dataset');

	// Put endpoints into their dataset
	mappedSources.datasets.forEach(function(dataset) {
		dataset.distribution = [];
		if(groupedEndpoints[dataset.identifier] !== undefined) {
			dataset.distribution = _.map(groupedEndpoints[dataset.identifier], function(item) {
				// Remove the dataset property from the distribution as it's only used by this script
				delete item.dataset;
				return item;
			});
		}
	});

	datajson.dataset = mappedSources.datasets;

	// Write the file to the disk
	//console.log(output);
	fs.writeFile('data.json', JSON.stringify(datajson, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('File written to data.json');
		}
	});
}
