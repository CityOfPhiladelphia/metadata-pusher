var _ = require('underscore'),
  Knack = require('./knack'),
  deepValue = require('./util/deep-value.js'),
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
  var self = this;
  return this.knack.objects(sources.datasets.objectId).records(datasetId).request({
    rows_per_page: 10000
  })
    .then(function(response) {
      var records;
      if(datasetId) records = [response.body]; // mapFields() expects an array of records
      else records = sources.datasets.parse ? sources.datasets.parse(response.body) : response.body;

      // Map fields to CKAN field names
      var mappedRecords = self.mapFields(records, sources.datasets.fields);
      return datasetId ? (mappedRecords[0] || {}) : mappedRecords; // If individual dataset requested, don't return an array
    });
};

DataCatalog.prototype.resources = function(datasetId) {
  var self = this;
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
  if(sources.resources.filters) {
    options.filters = JSON.stringify(sources.resources.filters);
  }
  return this.knack.views(sources.resources.viewId).records().request(options)
    .then(function(response) {
      // If source file provides a parse function, run the response through it
      var records = sources.resources.parse ? sources.resources.parse(response.body) : response.body;

      // Map fields to CKAN field names
      return self.mapFields(records, sources.resources.fields);
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

DataCatalog.prototype.mapFields = function(records, fieldMappings) {
	var converted, keyStack, key, value,
		mappedRecords = [];

	// Loop through source records
	records.forEach(function(record) {
		converted = {};

		// Loop through the fields defined in the config
		fieldMappings.forEach(function(field) {
			// Validate the required fields are provided in the field definition and are not null
			if(field.ckan !== undefined && field.ckan && field.source !== undefined && field.source) {
				// If the source is defined as a function, pass the record through the function
				// Otherwise the source is defined as a string, and refers to a property in the record
				// Uses deepValue function to get and set in case the source field is multidimensional (ie. 'foo.bar' instead of 'foo')
				deepValue(converted, field.ckan, typeof field.source === 'function' ? field.source(record) : deepValue(record, field.source));
			}
		});
		mappedRecords.push(converted);
	});
	return mappedRecords;
};

module.exports = DataCatalog;
