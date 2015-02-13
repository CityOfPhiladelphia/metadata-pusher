var request = require('request'),
	fs = require('fs'),
	config = require('./config.js');

// Lets the @keyString have depth, ie. 'foo' or 'foo.bar'
var deepValue = function(targetObj, keyString, value) {
	var keyStack = keyString.split('.'),
		obj = targetObj,
		key;
	while(obj && (key = keyStack.shift()) && (value === undefined || keyStack.length)) {
		if(value) obj[key] = {};
		obj = obj[key];
	}
	if(value) obj[key] = value;
	return obj;
}

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
				// Otherwise the source is defined as a string, and refers to a property in the record
				// Uses deepValue function to get and set in case the source field is multidimensional (ie. 'foo.bar' instead of 'foo')
				deepValue(converted, field.pod, typeof field.source === 'function' ? field.source(record) : deepValue(record, field.source));
			}
		});
		output.dataset.push(converted);
	});
	//console.log(output);
	fs.writeFile('data.json', JSON.stringify(output, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('File written to data.json');
		}
	})
});