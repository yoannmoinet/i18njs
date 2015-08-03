var fs = require('fs');
var conventionalChangelog = require('conventional-changelog');
var changelogFile = fs.createWriteStream('CHANGELOG.md');
var exec = require('child_process').exec;

conventionalChangelog({
	preset: 'angular'
}, {}, {
	from: 'e38ab164a5f5e8ef2768ebeda30007730f08427f',
	to: 'HEAD'
}).pipe(changelogFile);

console.log('commiting changes to CHANGELOG.md');
exec('git add CHANGELOG.md && git commit -m "docs: changelog"', function (err) {
	if (!err) {
		process.exit(0);
	}
	console.error(err);
	process.exit(1);
});
