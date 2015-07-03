var _ = require('underscore'),
  Knack = require('./knack'),
  mapFields = require('./util/map-fields'),
	config = {
		datasets: require('./config/datasets'),
		resources: require('./config/resources')
	};
require('dotenv').load();

var knack = new Knack(process.env.KNACK_APPLICATION_ID, process.env.KNACK_API_KEY);

var sourcePromises = [];
for(var key in config) {
  sourcePromises.push(
    knack.objects(config[key].sourceObject).records().request({
      rows_per_page: 10000,
      format: 'both'
    })
    .then(
      (function(key) {
        return function(response) {
          // If config provides a parse function, run the source through it
          var records = config[key].parse ? config[key].parse(response.body) : response.body;
          console.log(key, records.length);
          return mapFields(records, config[key].fields);
        };
      })(key)
    )
  );
}

Promise.all(sourcePromises).then(function(sources) {
  console.log('Combining');
  var datasets = sources[0],
    resources = sources[1],
    datasetsWithResources = [];

  // Group resources by their dataset id
	var groupedResources = _.groupBy(resources, 'dataset');

	// Put endpoints into their dataset
	datasets.forEach(function(dataset) {
		if(groupedResources[dataset.id] !== undefined) {
			dataset.resources = _.map(groupedResources[dataset.id], function(item) {
				// Remove the dataset property from the distribution as it's only used by this script
				delete item.dataset;
				return item;
			});
      datasetsWithResources.push(dataset);
		} else {
      console.error('No resources found for ' + dataset.title)
    }
	});

  return datasetsWithResources;
}, function(err) {
  console.error('Error fetching datasets & resources', err);
})
.then(function(datasets) {
  console.log('Finished with ' + datasets.length + ' datasets');
}, function(err) {
  console.error('Error combining datasets & resources', err);
})
