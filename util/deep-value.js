// Lets the @keyString have depth, ie. 'foo' or 'foo.bar'
module.exports = function(targetObj, keyString, value) {
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
