var _ = require('underscore'),
  Knack = require('./knack'),
  mapFields = require('./util/map-fields'),
  sources = {
    datasets: require('./sources/datasets'),
    resources: require('./sources/resources')
  };;

function DataCatalog(knackAppId, knackApiKey) {
  this.appId = knackAppId;
  this.apiKey = knackApiKey;

  // Initialize Knack client
  this.knack = new Knack(knackAppId, knackApiKey);
}

DataCatalog.prototype.datasets = function(datasetId) {
  return this.knack.objects(sources.datasets.objectId).records(datasetId).request({
    rows_per_page: 10000
  })
    .then(function(response) {
      var records;
      if(datasetId) records = [response.body]; // mapFields() expects an array of records
      else records = sources.datasets.parse ? sources.datasets.parse(response.body) : response.body;

      // Map fields to CKAN field names
      var mappedRecords = mapFields(records, sources.datasets.fields);
      return datasetId ? (mappedRecords[0] || {}) : mappedRecords; // If individual dataset requested, don't return an array
    });
};

DataCatalog.prototype.resources = function(datasetId) {
  var options = {
    rows_per_page: 10000
  };
  if(datasetId) {
    options.filters = JSON.stringify([{
      field: sources.resources.parentField,
      operator: 'is',
      value: datasetId
    }]);
  }
  return this.knack.views(sources.resources.viewId).records().request(options)
    .then(function(response) {
      // If source file provides a parse function, run the response through it
      var records = sources.resources.parse ? sources.resources.parse(response.body) : response.body;

      // Map fields to CKAN field names
      return mapFields(records, sources.resources.fields);
    });
};

DataCatalog.prototype.groupResources = function(datasets, resources) {
  var datasetsWithResources = [],
    singleDataset = false;

  // datasets param can be a single dataset or an array of datasets
  if( ! Array.isArray(datasets)) {
    singleDataset = true;
    datasets = [datasets];
  }

  // Group resources by their dataset id
	var groupedResources = _.groupBy(resources, 'dataset');

  datasets.forEach(function(dataset) {
		if(groupedResources[dataset.id] !== undefined) {
			dataset.resources = _.map(groupedResources[dataset.id], function(item) {
				// Remove the dataset property from the resource as it's only used by this script
				delete item.dataset;
				return item;
			});

      // Remove the id property from the dataset as it's Knack's record ID (CKAN uses its own)
      delete dataset.id;

      // This ensures datasets with no resources are excluded
      datasetsWithResources.push(dataset);
		}
	});

  return singleDataset ? (datasetsWithResources[0] || {}) : datasetsWithResources;
};

module.exports = DataCatalog;
