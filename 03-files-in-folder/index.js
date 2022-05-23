const fs = require('fs');
const path = require('path');
const secretFolder = path.resolve(__dirname, 'secret-folder');


fs.readdir(secretFolder, { withFileTypes: true, encoding: 'utf-8' }, (err, files) => {
  if (err) {
    throw console.log('myError readdir', err.code);
  }
  for (const file of files) {
    if (file.isFile()) {
      let fileURI = path.join(secretFolder, file.name);
      fs.stat(fileURI, (err, stats) => {
        if (err) {
          throw console.log('myError stats', err.code);
        }

        console.log(`${path.basename(file.name, path.extname(file.name))} - ${path.extname(file.name).replace('.','')} - ${stats.size}`);
      });

    }
  }
});
