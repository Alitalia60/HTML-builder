const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('node:readline');
const inOut = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const uri = path.resolve(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(uri, { 'encoding': 'utf-8' });
console.log('let enter some text, then press Ctrl+C:', '\n\r');
process.stdin.read();
process.stdin.on('data', (chunk) => {
  writeStream.write(chunk);
});
process.on('exit', ()=>console.log('File creatde ', uri));

