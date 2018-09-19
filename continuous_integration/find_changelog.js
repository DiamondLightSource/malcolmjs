var fs = require('fs');

const currentTag = process.argv[2];
const changelogContents = fs.readFileSync(__dirname + '/../CHANGELOG.md', 'utf8').split('\n');

const relevantLog = changelogContents.findIndex(line => line.startsWith('## ' + currentTag));

if (relevantLog < 0) {
  throw 'No changelog present for ' + currentTag
}

const endOfRelevantLog = changelogContents.findIndex((line, i) => i > relevantLog && line.startsWith('## '))

const tagLog = changelogContents.slice(relevantLog + 1, endOfRelevantLog).join('\n');

console.log(tagLog)