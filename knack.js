var request = require('request'),
  Promise = require('promise'),
  requestPromise = Promise.denodeify(request);

var Knack = function(appId, apiKey) {
  this.baseUrl = 'https://api.knackhq.com/v1/';
  this.appId = appId;
  this.apiKey = apiKey;
  this.path = [];
};

Knack.prototype.objects = function(id) {
  this.path.push('objects');
  if(id) this.path.push('object_' + id);
  return this;
};

Knack.prototype.records = function(id) {
  this.path.push('records');
  if(id) this.path.push('record_' + id);
  return this;
};

Knack.prototype.views = function(id) {
  this.path.push('views');
  if(id) this.path.push('view_' + id);
  return this;
}

Knack.prototype.request = function(options) {
  var url = this.baseUrl + this.path.join('/');
  this.path = []; // clear path when finished
  return requestPromise({
    url: url,
    qs: options || {},
    headers: {
      'X-Knack-Application-Id': this.appId,
      'X-Knack-REST-API-Key': this.apiKey
    },
    json: true
  });
}

module.exports = Knack;
