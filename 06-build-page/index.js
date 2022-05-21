const fs = require('fs');
const path = require('path');

//dst
const distFolder = path.resolve(__dirname, 'project-dist');
const distHtml = path.join(distFolder, 'index.html');
const assetsFolder = path.join(distFolder, 'assets');
const styleFolder = path.join(distFolder, 'styles');

//src
const componentsFolder = path.resolve(__dirname, 'components');
const templateHtml = path.resolve(__dirname, 'template.html');

const objComponents = {};

//1. create folder **project-dist**
//if exist folder **project-dist**
fs.mkdir(distFolder, (err) => {

  //!! ********
  if (err) {
    if (err.code !== 'EEXIST') {
      throw ("can't make folder", distFolder, err);
    }
  }

  //!! ********
  const rs = fs.createReadStream(templateHtml, 'utf-8');
  const distHtmlWS = fs.createWriteStream(distHtml, 'utf-8');

  let temlateContent = '';
  rs.read();
  rs.on('data', (templateChunk) => {
    temlateContent += templateChunk;
  });
  rs.on('end', () => {
    ['header', 'articles', 'foter'].forEach((tag) => {
      if (temlateContent.includes(`{{${tag}}}`)) {
        console.log('founded in template =', `{{${tag}}}`);

        const comp = fs.createReadStream(
          path.join(componentsFolder, `${tag}.html`), { encoding: 'utf-8' }
        );
        let componentContent = '';
        comp.read();
        comp.on('data', (componentChunk) => {
          componentContent += componentChunk
        })
        comp.on('end', () => {
          console.log('***********************');
          console.log('replacing tag=', `{{${tag}}}`);
          console.log('========================');
          console.log(componentContent);
          temlateContent.replace(`{{${tag}}}`, componentContent);
        });
      };
    });
    console.log('++++++++++++++++++++++');
    console.log(temlateContent);

    distHtmlWS.app(temlateContent);


  });
});