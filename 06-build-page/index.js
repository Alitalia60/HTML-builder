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

mergeStyles();
createDir(distAssetsFolder, false, copyAssets);
createDir(distProjectFolder, false, makeHTML);

function createDir(folderName, doItRecursive, callBack) {
  fs.access(folderName, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
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
    srcStyleFolder,
    { withFileTypes: false, encoding: 'utf-8' },
    (err, files) => {
      if (err) {
        if (err.code !== 'ENOENT') {
          throw console.log('myError copyStyles readdir', err);
        }
      }
      const wsBundle = fs.createWriteStream(
        path.join(distProjectFolder, 'style.css'),
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
    srcURI,
    { withFileTypes: true, encoding: 'utf-8' },
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

//!! generator
async function* tagReplacing(tags, templateContent) {
  for (const tag of tags) {
    await new Promise((resolve) => {
      if (templateContent.includes(`{{${tag}}}`)) {
        const comp = fs.createReadStream(
          path.join(srcComponentsFolder, `${tag}.html`),
          { encoding: 'utf-8' }
        );
        let componentContent = '';

        comp.read();

        comp.on('data', (componentChunk) => {
          componentContent += componentChunk;
        });

        comp.on('end', () => {
          try {
            templateContent = templateContent.replace(
              `{{${tag}}}`,
              componentContent
            );
            const distHtmlWS = fs.createWriteStream(distHtml, 'utf-8');
            distHtmlWS.write(templateContent);
            resolve();
          } catch (err) {
            throw console.log('mtError can\'t replace text', err);
          }
        });
      }
    });
    yield tag;
  }
}

async function doit(gen) {
  for await (const file of gen) {
    console.log(file);
  }
}

function makeHTML() {
  const rs = fs.createReadStream(srcTemplateHtml, 'utf-8');
  let templateContent = '';
  rs.read();

  rs.on('data', (templateChunk) => {
    templateContent += templateChunk;
  });

  rs.on('end', () => {
    const tags = [];
    fs.readdir(
      srcComponentsFolder,
      { withFileTypes: true, encoding: 'utf-8' },
      (err, files) => {
        for (const file of files) {
          if (file.isFile()) {
            if (path.extname(file.name).toLocaleLowerCase() === '.html') {
              tags.push(path.basename(file.name, '.html'));
            }
          }
        }
        const gen = tagReplacing(tags, templateContent);
        doit(gen);
      }
    );
  });
}
