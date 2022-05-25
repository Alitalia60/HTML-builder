const fs = require('fs');
const path = require('path');

//dst
const distProjectFolder = path.resolve(__dirname, 'project-dist');
const distHtml = path.join(distProjectFolder, 'index.html');
const distAssetsFolder = path.join(distProjectFolder, 'assets');

//src
const srcAssetsFolder = path.resolve(__dirname, 'assets');
const srcStyleFolder = path.resolve(__dirname, 'styles');
const srcComponentsFolder = path.resolve(__dirname, 'components');
const srcTemplateHtml = path.resolve(__dirname, 'template.html');

createDir(distProjectFolder, false, makeHTML);
createDir(distAssetsFolder, false, copyAssets);
mergeStyles();

function createDir(folderName, doItRecursive, callBack) {

  fs.access(folderName, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.mkdir(folderName, { recursive: doItRecursive }, (errMkdir) => {
          if (errMkdir) {
            if (errMkdir !== 'EEXIST') {
              throw console.log(' myError creating file ', folderName, errMkdir);
            }
          }
        });
      }
    }
    callBack();
  });
}

//!! copy styles from src to dst
function mergeStyles() {
  const distStyleBundle = path.join(distProjectFolder, 'style.css');

  fs.access(distStyleBundle, (errorAccess) => {
    if (errorAccess) {
      if (errorAccess.code !== 'ENOENT') {
        fs.rm(distStyleBundle, (errorRm) => {
          if (errorRm) {
            throw console.log('1. myError rm style.css <mergeStyles>', errorRm.code);
          }
        });
      }
    }

    fs.readdir(
      srcStyleFolder, { withFileTypes: false, encoding: 'utf-8' },
      (err, files) => {
        if (err) {
          if (err.code !== 'ENOENT') {
            throw console.log('myError <mergeStyles> readdir', err);
          }
        }
        const wsBundle = fs.createWriteStream(distStyleBundle, 'utf-8');
        for (const file of files) {
          if (path.extname(file) === '.css') {
            const rs = fs.createReadStream(
              path.join(srcStyleFolder, file),
              'utf-8'
            );
            rs.pipe(wsBundle);
          }
        }
      }
    );
  });
}

function makeFolder(folderURI) {
  fs.mkdir(folderURI, { recursive: true }, (err) => {
    if (err) {
      throw console.log('myError mkdir ', srcAssetsFolder);
    }
  });
}

function copyFiles(from, to) {
  fs.copyFile(from, to, (err) => {
    if (err) {
      throw console.log('my error copy file', err);
    }
  });
}

//!! copy assets
function copyDirAssets(srcURI, distURI) {
  fs.readdir(
    srcURI, { withFileTypes: true, encoding: 'utf-8' },
    (err, files) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          throw console.log('myError copyAssets readdir', err);
        }
      }

      for (const file of files) {
        const srcFileURI = path.join(srcURI, file.name);
        const dstFileURI = path.join(distURI, file.name);
        fs.stat(srcFileURI, (err, stats) => {
          if (stats.isDirectory()) {
            makeFolder(dstFileURI);
            copyDirAssets(srcFileURI, dstFileURI);
          }
          if (stats.isFile()) {
            copyFiles(srcFileURI, dstFileURI);
          }
        });
      }
    }
  );
}

function copyAssets() {
  copyDirAssets(srcAssetsFolder, distAssetsFolder);
}

function makeHTML() {

  let tags = [];
  fs.readdir(
    srcComponentsFolder, { withFileTypes: true, encoding: 'utf-8' },
    (err, files) => {
      if (err) {
        throw console.log('error readdir', err);
      }
      for (const file of files) {
        // console.log(file);
        if (file.isFile) {
          if (path.extname(file.name).toLocaleLowerCase() === '.html') {
            tags.push(path.basename(file.name, path.extname(file.name)));
          }
        }
      }

      fs.copyFile(srcTemplateHtml, distHtml, (err) => {
        if (err) {
          throw console.log('error copyFile', err);
        }
        fs.readFile(distHtml, 'utf-8', (err, content) => {
          if (err) {
            throw console.log('error readfile', err);
          }
          for (const tag of tags) {
            if (content.includes(`{{${tag}}}`)) {
              fs.readFile(
                path.join(srcComponentsFolder, `${tag}.html`),
                'utf-8',
                (err, data) => {
                  if (err) {
                    throw console.log('error readFile', err);
                  }
                  content = content.replace(`{{${tag}}}`, data);

                  fs.rm(distHtml, (err) => {
                    if (err) {
                      throw console.log('error rm File', err);
                    }
                    const distHtmlWS = fs.createWriteStream(distHtml, 'utf-8');
                    distHtmlWS.write(content);
                  });
                }
              );
            }
          }
        });
      });
    }
  );
}