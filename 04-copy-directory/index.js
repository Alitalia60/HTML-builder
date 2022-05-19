const path = require('path');
const fs = require('fs');

const fromFolder = path.resolve(__dirname, 'files');
const toFolder = path.resolve(__dirname, 'files-copy');

//check existing folder
fs.access(toFolder, (err) => {
  if (err) {
    try {
      //attemp create folder
      myCreateDir(toFolder);
    } catch (error) {
      throw console.log('my error creating dir', error);
    }
  }
  try {
    //attemp copy folder
    myCopyDir(fromFolder, toFolder);
  } catch (error) {
    throw console.log('my error copying dir', error);
  }
});

function myCreateDir(folderName) {
  fs.mkdir(folderName, { recursive: false }, (err) => {
    if (err) {
      throw console.log('my error mkdir', err);
    }
  });
}

function myCopyDir(from, to) {
  fs.readdir(from, (err, files) => {
    if (err) {
      throw console.log('my error mkdir', err);
    }
    for (const file of files) {
      fs.copyFile(path.join(fromFolder, file), path.join(to, file), (err)=>{
        if (err) {
          throw console.log('my error copy file', file,  err);
        }
      });
    }
  });
}
