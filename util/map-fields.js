var deepValue = require('./deep-value.js');

module.exports = function(records, fieldMappings) {
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
