var Promise = require('promise'),
  fs = require('fs'),
  DataCatalog = require('./data-catalog');

// Load environment variables from .env
require('dotenv').load();

// Initialize Data Catalog
var dataCatalog = new DataCatalog(process.env.KNACK_APPLICATION_ID, process.env.KNACK_API_KEY),
  dataCatalogPromises = [];

// Fetch datasets & resources
dataCatalogPromises.push(
  dataCatalog.datasets(),
  dataCatalog.resources()
);

// When all fetches are finished, group resources into their datasets
Promise.all(dataCatalogPromises).then(function(sources) {
  return dataCatalog.groupResources(sources[0], sources[1]);
}, function(err) {
  console.error('Error fetching datasets', err);
})

// Output contents to stdout
.then(function(datasets) {
  console.log(JSON.stringify(datasets, null, 4));
}, function(err) {
  console.error('Error grouping resources', err);
});
