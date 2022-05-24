const path = require('path');
const fs = require('fs');

const fromFolder = path.resolve(__dirname, 'files');
const toFolder = path.resolve(__dirname, 'files-copy');

fs.access(toFolder, (err) => {
  if (err) {
    try {
      myCreateDir(toFolder);
    } catch (error) {
      throw console.log('my error creating dir', error);
    }
  }
  try {
    clearDir(toFolder);
    myCopyDir(fromFolder, toFolder);
  } catch (error) {
    throw console.log('my error copying dir', error);
  }
});

function clearDir(folderName){
  fs.readdir(folderName, (err, files)=>{
    if (err) {
      throw console.log('error clearDir', err);
    }
    for (const file of files) {
      fs.unlink(path.join(folderName, file), (err)=>{
        if (err) {
          throw console.log('error delete files', err);
        }
      });
    }
  });
}

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
