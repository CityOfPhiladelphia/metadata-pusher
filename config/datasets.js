module.exports = {
	source: 'https://api.knackhq.com/v1/scenes/scene_34/views/view_73/records/export/applications/550c60d00711ffe12e9efc64?type=json',
	parse: function(response) {
		return response.records;
	},
	fields: [
		{
			'label': 'Title',
			'pod': 'title',
			'dcat': 'dct:title',
			'source': 'field_1'
		},
		{
			'label': 'Description',
			'pod': 'description',
			'dcat': 'dct:description',
			'source': function(record) {
				var desc = 'Contents: ' + record.field_2 + ' - Purpose: ' + record.field_3;
				if(record.field_4) desc += ' - Additional Comments: ' + record.field_4;
				return desc;
			}
		},
		{
			'label': 'Tags',
			'pod': 'keyword',
			'dcat': 'dcat:keyword',
			'source': null
		},
		{
			'label': 'Last Update',
			'pod': 'modified',
			'dcat': 'dct:modified',
			'source': null
		},
		{
			'label': 'Publisher',
			'pod': 'publisher',
			'dcat':	'dct:publisher',
			'source': 'field_31_raw.0.identifier'
		},
		{
			'label': 'Contact Name',
			'pod': 'contactPoint.fn',
			'dcat': 'dcat:contactPoint.vcard:fn',
			'source': null
		},
		{
			'label': 'Contact Email',
			'pod': 'contactPoint.hasEmail',
			'dcat': 'dcat:contactPoint.vcard:hasEmail',
			'source': 'field_26_raw.email'
		},
		{
      'label': 'Unique Identifier',
      'pod': 'identifier',
      'dcat': 'dct:identifier',
      'source': 'id'
    },
		{
			'label': 'Public Access Level',
			'pod': 'accessLevel',
			'dcat': null,
			'source': null
		},
		{
			'label': 'Rights',
			'pod': 'rights',
			'dcat': 'dct:rights',
			'source': null
		},
		{
			'label': 'Temporal',
			'pod': 'temporal',
			'dcat': 'dct:temporal',
			'source': null
		},
		{
			'label': 'Frequency',
			'pod': 'accrualPeriodicity',
			'dcat': 'dct:accrualPeriodicity',
			'source': 'field_41'
		},
		{
			'label': 'Data Quality',
			'pod': 'dataQuality',
			'dcat': null,
			'source': function(record) {
				return 'Hygiene: ' + record.field_42 + ' - Accuracy: ' + record.field_43;
			}
		},
		{
			'label': 'Data Dictionary Type',
			'pod': 'describedByType',
			'dcat': null,
			'source': null
		},
		{
			'label': 'System of Records',
			'pod': 'systemOfRecords',
			'dcat': null,
			'source': 'field_35'
		},
		{
			'label': 'Category',
			'pod': 'theme',
			'dcat': 'dcat:theme',
			'source': null
		}
	]
};
