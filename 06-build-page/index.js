const fs = require('fs');
const path = require('path');

//dst
const distProjectFolder = path.resolve(__dirname, 'project-dist');
const distHtml = path.join(distProjectFolder, 'index.html');
const distAssetsFolder = path.join(distProjectFolder, 'assets');
const distStyleFolder = path.join(distProjectFolder, 'styles');

//src

const srcAssetsFolder = path.resolve(__dirname, 'assets');
const srcStyleFolder = path.resolve(__dirname, 'styles');
const srcComponentsFolder = path.resolve(__dirname, 'components');
const srcTemplateHtml = path.resolve(__dirname, 'template.html');

const distHtmlWS = fs.createWriteStream(distHtml, 'utf-8');

createDir(distStyleFolder, false, mergeStyles);
createDir(distAssetsFolder, false, copyAssets);
console.log('task is not done');
process.exit();
// createDir(makeHTML, false, makeHTML);

function createDir(folderName, doItRecursive, callBack) {
  fs.access(folderName, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('creating file', folderName);
        fs.mkdir(folderName, { recursive: doItRecursive }, (err) => {
          if (err) {
            throw console.log(' myError creating file ', folderName, err);
          }
        });
      }
    }
    callBack();
  });
}

//!! copy styles from src to dst
function mergeStyles() {
  console.log('merge Styles begin');

  fs.readdir(
    srcStyleFolder, { withFileTypes: false, encoding: 'utf-8' },
    (err, files) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          throw console.log('myError copyStyles readdir', err);
        }
      }
      const wsBundle = fs.createWriteStream(
        path.join(distStyleFolder, 'style.css'),
        'utf-8'
      );
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
}


function makeFolder(folderURI) {
  fs.mkdir(folderURI, { recursive: true },
    (err) => {
      if (err) {
        throw console.log('myError mkdir ', srcAssetsFolder);
      }
    });
}

function copyFiles(from, to) {
  fs.copyFile(from, to, (err) => {
    if (err) {
      throw console.log('my error copy file', file, err);
    }
  })
}


//!! copy assets
function copyDirAssets(srcURI, distURI) {
  console.log('copying assets');

  fs.readdir(srcURI, { withFileTypes: true, encoding: 'utf-8' },
    (err, files) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          throw console.log('myError copyAssets readdir', err);
        }
      }

      console.log(files);

      for (const file of files) {
        const srcFileURI = path.join(srcURI, file.name);
        const dstFileURI = path.join(distURI, file.name);
        fs.stat(srcFileURI, (err, stats) => {
          if (stats.isDirectory()) {
            makeFolder(dstFileURI);
            copyDirAssets(srcFileURI, dstFileURI);
          };
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
//!! generator
const generetor = function*(array) {
  for (const item of array) {
    yield item;
  }
}

function makeHTML() {
  const rs = fs.createReadStream(srcTemplateHtml, 'utf-8');
  let templateContent = '';
  rs.read();

  rs.on('data', (templateChunk) => {
    templateContent += templateChunk;
    console.log('rs.on data');
  });

  rs.on('end', () => {
    console.log('rs.on end');
    ['header', 'articles', 'footer'].forEach((tag) => {
      if (templateContent.includes(`{{${tag}}}`)) {
        console.log('founded in template =', `{{${tag}}}`);
        // const comp = fs.createReadStream(
        //   path.join(srcComponentsFolder, `${tag}.html`), { encoding: 'utf-8' }
        // );
        // let componentContent = '';

        // comp.read();

        // comp.on('data', (componentChunk) => {
        //   componentContent += componentChunk
        // })

        // comp.on('end', () => {
        //   try {
        //     templateContent = templateContent.replace(`{{${tag}}}`, componentContent);
        //     console.log('replacing tag ', `{{${tag}}}`);
        //   } catch (error) {
        //     throw console.log('mtError can\'t replace text', err);
        //   }
        // });
      }
    });
  });
}

// async function replaceTag(tagName) {
// const comp = fs.createReadStream(
//   path.join(srcComponentsFolder, `${tag}.html`), { encoding: 'utf-8' }
// );
// let componentContent = '';

// comp.read();

// comp.on('data', (componentChunk) => {
//   componentContent += componentChunk;
// });

// comp.on('end', () => {
//   try {
//     templateContent = templateContent.replace(`{{${tag}}}`, componentContent);
//     console.log('replacing tag ', `{{${tag}}}`);
//   } catch (error) {
//     throw console.log('mtError can\'t replace text', err);
//   }
//   return templateContent;
// })