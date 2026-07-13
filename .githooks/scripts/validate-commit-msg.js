const fs = require('fs');

const commitMsgFile = process.argv[2];
const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

const pattern = /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf)(\([a-z0-9._-]+\))?: .+/;

if (!pattern.test(commitMsg)) {
  console.error('❌ Invalid commit message format.\n');
  console.error('Expected:');
  console.error('  type: short description');
  console.error('  type(scope): short description\n');
  console.error('Examples:');
  console.error('  feat: add login screen');
  console.error('  fix(api): fix user save error');
  console.error('  docs: update README');
  process.exit(1);
}