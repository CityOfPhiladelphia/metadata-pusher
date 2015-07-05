var restify = require('restify'),
  Promise = require('promise'),
  Knack = require('./knack'),
  CKAN = require('ckan'),
  mapFields = require('./util/map-fields'),
  sources = {
    datasets: require('./sources/datasets'),
		resources: require('./sources/resources')
  }

// Load environment variables from .env
require('dotenv').load();

// Initialize Knack client
var knack = new Knack(process.env.KNACK_APPLICATION_ID, process.env.KNACK_API_KEY);

// Initialize CKAN client
var ckan = new CKAN.Client(process.env.CKAN_HOST, process.env.CKAN_API_KEY);

// Initialize server
var server = restify.createServer({
  name: 'Catalog Pusher'
});

// Create route for pushing to CKAN
server.post('/ckan/:id', function(req, res, next) {

  var datasetId = req.params.id;
  var sourcePromises = [];

  sourcePromises.push(
    // Fetch dataset
    knack.objects(sources.datasets.objectId).records(datasetId).request()
    .then(function(response) {
      // mapFields() expects an array of records
      var records = [response.body];

      // Map fields to CKAN field names
      return mapFields(records, sources.datasets.fields);
    }, function(err) {
      res.send({error: err});
    }),

    // Fetch resources
    knack.views(sources.resources.viewId).records().request({
      filters: JSON.stringify([{
        field: sources.resources.parentField,
        operator: 'is',
        value: datasetId
      }]),
      rows_per_page: 100
    })
    .then(function(response) {
      // If source file provides a parse function, run the response through it
      var records = sources.resources.parse ? sources.resources.parse(response.body) : response.body;

      // Map fields to CKAN field names
      return mapFields(records, sources.resources.fields);
    }, function(err) {
      res.send({error: err});
    })
  );

  // When all fetches are finished
  Promise.all(sourcePromises).then(function(sources) {
    var dataset = sources[0][0]; // should be a 1-record array
    dataset.resources = sources[1]; // put resources into dataset object

    // Remove the dataset id property from each resource as it's only used by this script
    dataset.resources = dataset.resources.map(function(resource) {
      delete resource.dataset;
      return resource;
    });

    // Remove the id property from the dataset as it's Knack's record ID (CKAN uses its own)
    delete dataset.id;

    res.send(dataset);
    next();
  }, function(err) {
    res.send({error: err});
  });
});

// Run server
server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
