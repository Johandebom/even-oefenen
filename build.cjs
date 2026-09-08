const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
let html=fs.readFileSync(path.join(root,'page.html'),'utf8');
for(const filename of ['blok-1.js','repetition.js','app.js']){
  const source=fs.readFileSync(path.join(root,filename),'utf8').replace(/<\/script/gi,'<\\/script');
  html=html.replace('<script src="'+filename+'"></script>',()=>'<script>\n'+source+'\n</script>');
}
fs.writeFileSync(path.join(root,'index.html'),html);
fs.writeFileSync(path.join(root,'blok-1.json'),JSON.stringify(require('./blok-1.js'),null,2));
console.log('Zelfstandige index.html en 70 leeritems gereed.');

