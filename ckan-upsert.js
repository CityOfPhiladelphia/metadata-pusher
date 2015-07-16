var _ = require('underscore'),
  Promise = require('promise');

module.exports = function(ckan, dataset) {
  // Promiseify ckan.action()
  var ckanAction = function(method, data) {
    return new Promise(function(resolve, reject) {
      ckan.action(method, data, function(err, res) {
        if(err) reject(err);
        else resolve(res);
      });
    });
  };

  // Check if the dataset exists in CKAN
  return ckanAction('package_show', {id: dataset.name})
    .then(function(response) {
      // Found the dataset - update it
      console.log('Found dataset', dataset.name);

      // Fill in missing fields from CKAN into the Knack record (otherwise they'd get erased)
      _.defaults(dataset, response.result);

      return ckanAction('package_update', dataset)
        .then(function(response) {
          console.log('Success updating', response.result.name);
          return response.result;
        }, function(err) {
          console.error('Error updating', err);
        });
    }, function(err) {
      // Couldn't find the dataset - create it
      console.error('Error finding dataset', dataset.name);

      return ckanAction('package_create', dataset)
        .then(function(response) {
          console.log('Success creating', response.result.name);
          return response.result;
        }, function(err) {
          console.error('Error creating', dataset.name, err);
        });
    });
}
