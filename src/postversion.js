var fs = require('fs');
var bower = require('../bower.json');
var pkg = require('../package.json');
var exec = require('child_process').exec;

// Update Bower's version to follow NPM's
bower.version = pkg.version;

fs.writeFile('bower.json', JSON.stringify(bower, null, 2), function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('bower.json updated to ' + bower.version);
	console.log('commiting changes to CHANGELOG.md ...');
	commitChangelog(function (err) {
		if (!err) {
			console.log('commiting changes to bower.json ...');
			commitBower(function (err) {
				if (!err) {
					console.log('everything is fine and commited');
					return;
				}
				console.error(err);
			});
			return;
		}
		console.error(err);
	});
});

function execCommand (cmd, cb) {
	exec(cmd, function (err, stdout, stderr) {
		cb.apply(this, arguments);
	});
}

function commitChangelog (cb) {
	execCommand('git add CHANGELOG.md && git commit -m "docs: changelog"', cb);
}

function commitBower (cb) {
	execCommand('git add bower.json && git commit -m "chore: bower bump"', cb);
}