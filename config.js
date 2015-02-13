module.exports = {
	source: 'https://api.knackhq.com/v1/scenes/scene_16/views/view_54/records/export/applications/541b04e99a3db5a01b00b13b?type=json',
	parse: function(response) {
		return response.records;
	},
	fields: [
		{
			'label': 'Title',
			'pod': 'title',
			'dcat': 'dct:title',
			'source': 'field_199'
		},
		{
			'label': 'Description',
			'pod': 'description',
			'dcat': 'dct:description',
			'source': function(record) {
				var desc = 'Contents: ' + record.field_202 + ' - Purpose: ' + record.field_203;
				if(record.field_204) desc += ' - Additional Comments: ' + record.field_204;
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
			'source': 'field_211'
		},
		{
			'label': 'Publisher',
			'pod': 'publisher',
			'dcat':	'dct:publisher',
			'source': 'field_216_raw.0.identifier'
		},
		{
			'label': 'Contact Name',
			'pod': 'contactPoint',//.fn',
			'dcat': null,//'dcat:contactPoint.vcard:fn',
			'source': null
		},
		{
			'label': 'Contact Email',
			'pod': 'contactPoint',//.hasEmail',
			'dcat': null,//'dcat:contactPoint.vcard:hasEmail',
			'source': 'field_201'
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
			'source': 'field_212'
		},
		{
			'label': 'Rights',
			'pod': 'rights',
			'dcat': 'dct:rights',
			'source': 'field_213'
		},
		{
			'label': 'Temporal',
			'pod': 'temporal',
			'dcat': 'dct:temporal',
			'source': 'field_205'
		},
		{
			'label': 'Frequency',
			'pod': 'accrualPeriodicity',
			'dcat': 'dct:accrualPeriodicity',
			'source': 'field_210'
		},
		{
			'label': 'Data Quality',
			'pod': 'dataQuality',
			'dcat': null,
			'source': function(record) {
				return 'Hygiene: ' + record.field_208 + ' - Accuracy: ' + record.field_209;
			}
		},
		{
			'label': 'Data Dictionary Type',
			'pod': 'describedByType',
			'dcat': null,
			'source': 'field_207'
		},
		{
			'label': 'System of Records',
			'pod': 'systemOfRecords',
			'dcat': null,
			'source': 'field_206'
		},
		{
			'label': 'Category',
			'pod': 'theme',
			'dcat': 'dcat:theme',
			'source': null
		}
	]
};
