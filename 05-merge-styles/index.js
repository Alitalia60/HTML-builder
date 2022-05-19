const fs = require('fs');
const path = require('path');

const pojectFolder = path.resolve(__dirname, 'project-dist');
const bundleFileUri = path.join(pojectFolder, 'bundle.css');
const stylesFolderUri = path.resolve(__dirname, 'styles');

const ws = fs.createWriteStream(bundleFileUri,'utf-8');

fs.readdir(stylesFolderUri, (err, files)=>{
  if (err) {
    throw console.log('myError readdir', err);
  }

  for (const file of files) {
    if (path.extname(file) ==='.css') {
      writeToBundle(path.join(stylesFolderUri,file));
      
    }
  }
});

function writeToBundle(fileUri) {
  const rs = fs.createReadStream(fileUri, 'utf-8');
  rs.read();
  rs.on('data', (data)=>{
    ws.write(data, (err)=>{
      if (err) {
        console.log('error write ', err);
      }
    });
  });
}