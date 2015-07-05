var Promise = require('promise'),
  fs = require('fs'),
  CKAN = require('ckan'),
  ckanUpsert = require('./ckan-upsert'),
  DataCatalog = require('./data-catalog');

// Load environment variables from .env
require('dotenv').load();

// Initialize CKAN client
var ckan = new CKAN.Client(process.env.CKAN_HOST, process.env.CKAN_API_KEY);

// Initialize Data Catalog
var dataCatalog = new DataCatalog(process.env.KNACK_APPLICATION_ID, process.env.KNACK_API_KEY);

var dataCatalogPromises = [];

// Fetch datasets & resources
dataCatalogPromises.push(
  dataCatalog.datasets(),
  dataCatalog.resources()
);

// When all fetches are finished, group resources into their datasets
Promise.all(dataCatalogPromises).then(function(sources) {
  return dataCatalog.groupResources(sources[0], sources[1]);
}, function(err) {
  console.error('Error', err);
})

// Generate a file for debugging purposes
/*.then(function(datasets) {
  var writeFile = Promise.denodeify(fs.writeFile);
  return writeFile('./sources/datasets_with_resources.json', JSON.stringify(datasets, null, 4));
})
// Use this in debug mode to use the file instead of the Knack API
new Promise(function(resolve, reject) {
  resolve(require('./sources/datasets_with_resources.json'));
})*/
.then(function(datasets) {
  console.log('Finished combining ' + datasets.length + ' datasets');

  var ckanPromises = [];

  // Loop through each dataset and push it to CKAN
  datasets.slice(0, 3).forEach(function(dataset) {
    ckanPromises.push(ckanUpsert(ckan, dataset));
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
