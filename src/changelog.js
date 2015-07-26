var fs = require('fs');
var conventionalChangelog = require('conventional-changelog');
var changelogFile = fs.createWriteStream('CHANGELOG.md');

conventionalChangelog({
	preset: 'angular'
}, {}, {
	from: 'e38ab164a5f5e8ef2768ebeda30007730f08427f',
	to: 'HEAD'
}).pipe(changelogFile);