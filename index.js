var _ = require('underscore'),
  Promise = require('promise'),
  Knack = require('./knack'),
  fs = require('fs'),
  CKAN = require('ckan'),
  slug = require('slug'),
  mapFields = require('./util/map-fields'),
	sources = {
		datasets: require('./sources/datasets'),
		resources: require('./sources/resources')
	};

// Load environment variables from .env
require('dotenv').load();

// Initialize Knack client
var knack = new Knack(process.env.KNACK_APPLICATION_ID, process.env.KNACK_API_KEY);

// Initialize CKAN client
var ckan = new CKAN.Client(process.env.CKAN_HOST, process.env.CKAN_API_KEY);

/*var sourcePromises = [];

// Fetch each source and map its fields
for(var key in sources) {
  sourcePromises.push(
    knack.request(sources[key].apiPath, {
      rows_per_page: 10000,
      format: 'both'
    })
    .then(
      (function(key) {
        return function(response) {
          // If config provides a parse function, run the source through it
          var records = sources[key].parse ? sources[key].parse(response.body) : response.body;
          return mapFields(records, sources[key].fields);
        };
      })(key)
    )
  );
}

// Once all sources are fetched & their fields mapped, put resources into their datasets
Promise.all(sourcePromises).then(function(sources) {
  var datasets = sources[0],
    resources = sources[1],
    datasetsWithResources = [];

  // Group resources by their dataset id
	var groupedResources = _.groupBy(resources, 'dataset');

	// Put resources into their dataset
	datasets.forEach(function(dataset) {
		if(groupedResources[dataset.id] !== undefined) {
			dataset.resources = _.map(groupedResources[dataset.id], function(item) {
				// Remove the dataset property from the resource as it's only used by this script
				delete item.dataset;
				return item;
			});
      // This ensures datasets with no resources are excluded
      datasetsWithResources.push(dataset);
		}
	});

  return datasetsWithResources;
}, function(err) {
  console.error('Error fetching datasets & resources', err);
})*/
new Promise(function(resolve, reject) {
  resolve(require('./sources/datasets_with_resources.json'));
})
.then(function(datasets) {
  console.log('Finished combining ' + datasets.length + ' datasets');

  var ckanPromises = [];
  datasets.slice(0, 1).forEach(function(dataset) {
    // Make sure the dataset has a slug
    dataset.name = dataset.name || slug(dataset.title, {lower: true});

    // Check if the dataset exists
    ckanPromises.push(
      new Promise(function(resolve, reject) {
        ckan.action('package_show', {id: dataset.name}, function(err, res) {
          if(err) reject(err);
          else resolve(res);
        });
      })
      .then(function() {
        console.log('Found dataset', arguments);
        // TODO: Compare & update
      }, function(err) {
        console.error('Error finding dataset', err);
        // Create dataset
      })
    );
  });

  return Promise.all(ckanPromises);

}, function(err) {
  console.error('Error combining datasets & resources', err);
})
.then(function() {
  console.log('All done');
}, function(err) {
  console.error('Error', err);
})
