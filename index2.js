var Knack = require('./knack'),
  mapFields = require('./util/map-fields'),
	config = {
		datasets: require('./config/datasets'),
		resources: require('./config/resources')
	};
require('dotenv').load();

var knack = new Knack(process.env.KNACK_APPLICATION_ID, process.env.KNACK_API_KEY);

var sourcePromises = [];
for(var key in config) {
  sourcePromises.push(
    knack.objects(config[key].sourceObject).records().request({
      rows_per_page: 2,
      format: 'both'
    })
    .then(
      (function(key) {
        return function(response) {
          // If config provides a parse function, run the source through it
          var records = config[key].parse ? config[key].parse(response.body) : response.body;
          console.log(key, 'records: ', records);
          return mapFields(records, config[key].fields);
        };
      })(key)
    )
  );
}

Promise.all(sourcePromises)
.then(function(results) {
  console.log('Finished', results.length);
}, function(err) {
  console.error('Error', err);
})
