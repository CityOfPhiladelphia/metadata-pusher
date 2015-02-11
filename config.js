module.exports = {
	source: 'https://api.knackhq.com/v1/scenes/scene_14/views/view_49/records/export/applications/541b04e99a3db5a01b00b13b?type=json',
	parse: function(response) {
		return response.records;
	},
	fields: {
		[
			'label': 'Title',
			'pod': 'title',
			'dcat': 'dct:title',
			'source': 'field_199'
		],
		[
			'label': 'Description',
			'pod': 'description',
			'dcat': 'dct:description',
			'source': function(record) {
				return 'Contents: ' + record.field_202 + ' - Purpose: ' + record.field_203;
			}
		],
		[
			'label': 'Tags',
			'pod': 'keyword',
			'dcat': 'dcat:keyword'
			'source': null
		],
		[
			'label': 'Last Update',
			'pod': 'modified',
			'dcat': 'dct:modified'
			'source': null
		],
		[
			'label': 'Publisher',
			'pod': 'publisher',
			'dcat':	'dct:publisher'
			'source': function(record) {
	                        return record.field_216_raw.identifier;
	                }
		],
		[
			'label': 'Contact Name',
			'pod': 'contactPoint',
			'dcat': 'dcat:contactPoint',
			'source': null // Supposed to be in vCard format
		],
		[
			'label': 'Contact Email',
			'pod': 'mbox',
			'dcat': 'foaf:mbox',
			'source': 'field_201'
		],
                [
                        'label': 'Unique Identifier',
                        'pod': 'identifier',
                        'dcat': 'dct:identifier',
                        'source': null
                ],
		[
			'label': 'Public Access Level',
			'pod': 'accessLevel',
			'dcat': null,
			'source': 'field_212'
		]
	}
};
