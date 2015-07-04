var slug = require('slug');

slug.charmap['/'] = '-'; // slug library strips slashes by default instead of treating them as a space

module.exports = {
	//source: 'https://api.knackhq.com/v1/scenes/scene_34/views/view_73/records/export/applications/550c60d00711ffe12e9efc64?type=json',
	//source: './data/datasets.json',
	apiPath: 'views/view_73/records',
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
			'label': 'Last Update',
			'pod': 'modified',
			'dcat': 'dct:modified',
			'ckan': null,
			'source': null
		},
		/*{
			'label': 'Publisher',
			'pod': 'publisher',
			'dcat':	'dct:publisher',
			'ckan': 'department',
			'source': 'field_31_raw.0.identifier'
		},*/
		{
			'label': 'Tags',
			'pod': 'keyword',
			'dcat': 'dcat:keyword',
			'ckan': 'tags',
			'source': function(record) {
				return record.field_31_raw.length ? [ {name: record.field_31_raw[0].identifier} ] : null;
			}
		},
		{
			'label': 'Extras',
			'pod': null,
			'dcat': null,
			'ckan': 'extras',
			'source': function(record) {
				return record.field_31_raw.length ? [ {key: 'Department', value: record.field_31_raw[0].identifier} ] : null;
			}
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
      'source': function(record) {
				// Use the slug field if it has a value, otherwise create a slug from the title
				return record.field_185 !== '' ? record.field_185 : slug(record.field_1, {lower: true});
			}
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
			'ckan': 'groups',
			'source': function(record) {
				return record.field_172_raw.length ? record.field_172_raw.map(function(item) {
					return {name: slug(item.identifier, {lower: true}) + '-group'};
				}) : [{name: 'uncategorized-group'}];
			}
		}
	]
};
