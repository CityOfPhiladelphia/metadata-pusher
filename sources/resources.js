var mediaTypes = {
  'API': null,
  'CSV': 'text/csv',
  'Data Lens Page': 'text/html',
  'GeoJSON': 'application/vnd.geo+json',
  'KML': '',
  'Metadata': 'text/html',
  'SHP': '',
  'Excel': '',
  'GDB': '',
  'HTML': '',
  'Imagery': '',
  'JSON': 'application/json',
  'KMZ': '',
  'MD': '',
  'MrSID': '',
  'TOPOJSON': '',
  'TSV': '',
  'TXT': '',
  'XML': ''
};

module.exports = {
	//source: 'https://api.knackhq.com/v1/scenes/scene_34/views/view_74/records/export/applications/550c60d00711ffe12e9efc64?type=json',
  //source: './data/resources.json',
  apiPath: 'views/view_74/records',
	parse: function(response) {
		return response.records;
	},
	fields: [
    {
      'label': 'Dataset ID', // meta field
      'pod': 'dataset',
      'ckan': 'dataset',
      'source': 'field_11_raw.0.id'
    },
		{
			'label': 'Title',
			'pod': 'title',
			'dcat': 'dct:title',
      'ckan': 'name',
			'source': function(record) {
        var title = record.field_13_raw.length ? record.field_13_raw[0].identifier : record.field_12;
        if(record.field_12) title += ' (' + record.field_12 + ')';
        return title;
      }
		},
		{
			'label': 'Description',
			'pod': 'description',
			'dcat': 'dct:description',
      'ckan': 'description',
			'source': 'field_47'
		},
    {
      'label': 'Download URL',
      'pod': 'downloadURL',
      'dcat': 'dcat:downloadURL',
      'ckan': 'url',
      'source': 'field_25_raw.url'
    },
    {
      'label': 'Format',
      'pod': 'format',
      'dcat': 'dct:format',
      'ckan': 'format',
      'source': 'field_12'
    }
	]
};
