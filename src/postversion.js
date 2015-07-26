var fs = require('fs');
var bower = require('../bower.json');
var pkg = require('../package.json');

// Update Bower's version to follow NPM's
bower.version = pkg.version;

fs.writeFile('bower.json', JSON.stringify(bower, null, 2), function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('bower.json updated to ' + bower.version);
});