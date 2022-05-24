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

console.log('task is not complete');
createDir(distStyleFolder, false, mergeStyles);
createDir(distAssetsFolder, false, copyAssets);
// createDir(distProjectFolder, false, makeHTML);

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
  fs.readdir(srcURI, { withFileTypes: true, encoding: 'utf-8' },
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
async function* tagReplacing(tags, templateContent) {
  for (const tag of tags) {
    await new Promise((resolve) => {
      if (templateContent.includes(`{{${tag}}}`)) {
        console.log('founded in template =', `{{${tag}}}`);
        const comp = fs.createReadStream(
          path.join(srcComponentsFolder, `${tag}.html`), { encoding: 'utf-8' }
        );
        let componentContent = '';

        comp.read();

        comp.on('data', (componentChunk) => {
          componentContent += componentChunk
        })

        comp.on('end', () => {
          try {
            templateContent = templateContent.replace(`{{${tag}}}`, componentContent);
            console.log('replacing tag ', `{{${tag}}}`);
          } catch (error) {
            throw console.log('mtError can\'t replace text', err);
          }
        });
      }
      resolve(console.log('html ready'));
    });
    yield tag;
  }
}


async function doit(gen) {
  for await (const file of gen) {
    console.log(file);
  };

  // wsBundle.write()
};

function makeHTML() {
  console.log(srcTemplateHtml);
  const rs = fs.createReadStream(srcTemplateHtml, 'utf-8');
  let templateContent = '';
  rs.read();

  rs.on('data', (templateChunk) => {
    templateContent += templateChunk;
  });

  rs.on('end', () => {
    const tags = ['header', 'articles', 'footer'];
    const gen = tagReplacing(tags, templateContent);
    doit(gen)
  });
}