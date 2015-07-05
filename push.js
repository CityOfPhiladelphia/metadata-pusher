var Promise = require('promise'),
  CKAN = require('ckan'),
  ckanUpsert = require('./ckan-upsert');

// Load environment variables from .env
require('dotenv').load();

// Initialize CKAN client
var ckan = new CKAN.Client(process.env.CKAN_HOST, process.env.CKAN_API_KEY);

// Read JSON from stdin
process.stdin.setEncoding('utf-8');

var chunks = '';
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if(chunk !== null) chunks += chunk;
});

process.stdin.on('end', function() {
  var datasets = JSON.parse(chunks),
    ckanPromises = [];

  console.log('Pushing %s datasets', datasets.length);

  // Loop through each dataset and push it to CKAN
  datasets.slice(0, 3).forEach(function(dataset) {
    ckanPromises.push(ckanUpsert(ckan, dataset));
  });

  Promise.all(ckanPromises).then(function() {
    console.log('Finished pushing %s datasets', ckanPromises.length);
  });
});
