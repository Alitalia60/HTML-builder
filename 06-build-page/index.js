const fs = require('fs');
const path = require('path');


//src
const componentsFolder = path.resolve(__dirname, 'components');
const templateHtml = path.resolve(__dirname, 'template.html');
const assetsFolder = path.join(distFolder, 'assets');
const styleFolder = path.join(distFolder, 'styles');

//dst
const distFolder = path.resolve(__dirname, 'project-dist');
const distHtml = path.join(distFolder, 'index.html');

//1. create folder **project-dist**
fs.mkdir(distFolder,(err)=>{
  if (err) {
    throw ('can\'t create folder', err);
  }
  createHtml();  
});

//2. replace tegs in index.htmp
function createHtml(){
  const rs = fs.createReadStream(templateHtml,'utf-8');
  rs.read();
  rs.on('data', (data)=>{
    ['header', 'articles', 'footer'].forEach(tag => {
      if (data.includes(`{{${tag}}}`)) {
        data.replace(`{{${tag}}}`, fromSource(tag));
      }
    });
  });
}

function fromSource(tag) {
  const comp = fs.createReadStream(path.join(componentsFolder, tag));
  comp.read();
}
