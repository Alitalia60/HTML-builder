const fs = require('fs');
const path = require('path');
const { stdin } = require('process');
const uri = path.resolve(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(uri, { 'encoding': 'utf-8' });
console.log('let enter some text, then press Ctrl+C:', '\n\r');
stdin.read();
stdin.on('data', (chunk) => {
  writeStream.write(chunk);
});