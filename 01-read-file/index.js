const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const uri = path.resolve(__dirname, 'text.txt');

const readStrm = fs.createReadStream(uri);
// readStrm.setEncoding('utf-8');
readStrm.read();
readStrm.on('data', (chunk) => {
    stdout.write(chunk);
});