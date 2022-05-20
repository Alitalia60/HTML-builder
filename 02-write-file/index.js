const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const uri = path.resolve(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(uri);
writeStream.setDefaultEncoding('utf-8');

process.stdout.write('let enter some text, then press Ctrl+C:', '\n\r');
process.stdin.read();
process.stdin.on('data', (chunk) => {
    writeStream.write(chunk);
});