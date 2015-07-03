module.exports = {
	//source: 'https://api.knackhq.com/v1/scenes/scene_34/views/view_73/records/export/applications/550c60d00711ffe12e9efc64?type=json',
	//source: './data/datasets.json',
	sourceObject: 'object_1',
	parse: function(response) {
		return response.records;
	},
	fields: [
		{
			'label': 'Title',
			'pod': 'title',
			'dcat': 'dct:title',
			'ckan': 'title',
			'source': 'field_1'
		},
		{
			'label': 'Description',
			'pod': 'description',
			'dcat': 'dct:description',
			'ckan': 'notes',
			'source': 'field_97'
		},
		{
			'label': 'Tags',
			'pod': 'keyword',
			'dcat': 'dcat:keyword',
			'ckan': 'tags',
			'source': null
		},
		{
			'label': 'Last Update',
			'pod': 'modified',
			'dcat': 'dct:modified',
			'ckan': null,
			'source': null
		},
		{
			'label': 'Publisher',
			'pod': 'publisher',
			'dcat':	'dct:publisher',
			'ckan': null,
			'source': 'field_31_raw.0.identifier'
		},
		{
			'label': 'Contact Name',
			'pod': 'contactPoint.fn',
			'dcat': 'dcat:contactPoint.vcard:fn',
			'ckan': 'author',
			'source': null
		},
		{
			'label': 'Contact Email',
			'pod': 'contactPoint.hasEmail',
			'dcat': 'dcat:contactPoint.vcard:hasEmail',
			'ckan': 'author_email',
			'source': 'field_26_raw.email'
		},
		{
      'label': 'Unique Identifier',
      'pod': 'identifier',
      'dcat': 'dct:identifier',
			'ckan': 'id',
			'source': 'id'
		},
		{
			'label': 'Slug',
			'pod': null,
			'dcat': null,
			'ckan': 'name',
      'source': 'field_185'
    },
		{
			'label': 'Public Access Level',
			'pod': 'accessLevel',
			'dcat': null,
			'ckan': null,
			'source': null
		},
		{
			'label': 'Rights',
			'pod': 'rights',
			'dcat': 'dct:rights',
			'ckan': null,
			'source': null
		},
		{
			'label': 'Temporal',
			'pod': 'temporal',
			'dcat': 'dct:temporal',
			'ckan': null,
			'source': null
		},
		{
			'label': 'Frequency',
			'pod': 'accrualPeriodicity',
			'dcat': 'dct:accrualPeriodicity',
			'ckan': null,
			'source': 'field_41'
		},
		{
			'label': 'Data Quality',
			'pod': 'dataQuality',
			'dcat': null,
			'ckan': null,
			'source': function(record) {
				return 'Hygiene: ' + record.field_42 + ' - Accuracy: ' + record.field_43;
			}
		},
		{
			'label': 'Data Dictionary Type',
			'pod': 'describedByType',
			'dcat': null,
			'ckan': null,
			'source': null
		},
		{
			'label': 'System of Records',
			'pod': 'systemOfRecords',
			'dcat': null,
			'ckan': null,
			'source': 'field_35'
		},
		{
			'label': 'Category',
			'pod': 'theme',
			'dcat': 'dcat:theme',
			'ckan': 'ckan',
			'source': 'field_172_raw.0.identifier'
		}
	]
};
