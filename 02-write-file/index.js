const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const inOut = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const uri = path.resolve(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(uri, { encoding: 'utf-8' });
console.log('let enter some text, then press Ctrl+C:', '\n\r');

inOut.on('line', (chunk) => {
  if (chunk.includes('exit')) {
    process.exit(0);
  }
  writeStream.write(chunk);
});

process.on('exit', () => console.log('File created ', uri));
