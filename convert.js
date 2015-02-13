var request = require('request'),
	config = require('./config.js');

var output = {};

// Catalog Fields
output['@type'] = 'dcat:Catalog';
output.conformsTo = 'https://project-open-data.cio.gov/v1.1/schema';
output.dataset = [];

// Fetch source
request({
	url: config.source, 
	json: true
}, function(err, response, body) {
	// If config provides a parse function, run the source through it
	var records = config.parse ? config.parse(body) : body,
		converted,
		keyStack,
		key,
		value;

	// Loop through source records
	records.forEach(function(record) {
		converted = {};

		// Loop through the fields defined in the config
		config.fields.forEach(function(field) {
			// Validate the required fields are provided in the field definition and are not null
			if(field.pod !== undefined && field.pod && field.source !== undefined && field.source) {
				// If the source is defined as a function, pass the record through the function
				if(typeof field.source === 'function') {
					converted[field.pod] = field.source(record);
				}
				// Otherwise the source is defined as a string, and refers to a property in the record
				else {
					//converted[field.pod] = record[field.source];
					keyStack = field.source.split('.');
					value = record;
					while(value && (key = keyStack.shift())) {
						value = value[key];
					}
					converted[field.pod] = value;
				}
			}
		});
		output.dataset.push(converted);
	});
	console.log(output.dataset);
});