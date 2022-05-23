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

console.log('task is noy done');
process.exit();
// createDir(distAssetsFolder, false, copyAssets);
// createDir(makeHTML, false, makeHTML);

function createDir(folderName, doItRecursive, callBack) {
  fs.access(folderName, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('creating folder', folderName);
        fs.mkdir(folderName, { recursive: doItRecursive }, (err) => {
          if (err) {
            throw console.log(' myError creating folder ', folderName, err);
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
    srcStyleFolder, { withFileTypes: true, encoding: 'utf-8' },
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

//!! copy assets
function copyAssets() {
  console.log('copying assets');

  fs.readdir(
    srcAssetsFolder, { withFileTypes: true, encoding: 'utf-8' },
    (err, files) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          throw console.log('myError copyAssets readdir', err);
        }
      }
      console.log('get files', files);
      for (const file of files) {
        console.log('prrocess file ', file.name);
        fs.stat(path.join(srcAssetsFolder, file.name), (err, stats) => {
          if (err) {
            throw console.log('myError fs.stat', file.name);
          }

          if (stats.isDirectory()) {
            fs.mkdir(
              path.join(distAssetsFolder, file.name), { recursive: true },
              (err) => {
                console.log('readed is folder ', file.name);
                if (err) {
                  throw console.log('myError mkdir ', srcAssetsFolder);
                }
              }
            );
          } else {
            console.log(
              'copy file',
              path.join(srcAssetsFolder, file),
              path.join(distAssetsFolder, file)
            );
            fs.copyFile(
              path.join(srcAssetsFolder, file),
              path.join(distAssetsFolder, file),
              (err) => {
                if (err) {
                  throw console.log('my error copy file', file, err);
                }
              }
            );
          }
        });
      }
    }
  );
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