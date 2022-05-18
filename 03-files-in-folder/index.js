const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');


fs.readdir(secretFolder, (err, files) => {
  for (const file of files) {
    console.log(file);
    

    // fs.stat(path.join(__dirname, file), (err, stats) => {
    //   console.log(stats.size);
    //   if (err) {
    //     console.log(err);
    //   }
    // });
  }
});

/* <имя файла>-<расширение файла>-<вес файла> */
