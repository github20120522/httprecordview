# iView-project

This project is build for Vue.js 2 + vue-router + webpack2 + iView 3, just install and run.

## Install
```bush
// install dependencies
npm install
```
## Run
### Development
```bush
// replace 
// fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
// to 
// fs.write(fd, buf, function(err, written, buffer) {});
// in webpack.dev.config.js and webpack.prod.config.js

// For the first time, run init to create index.html
npm run init

npm run dev
```
### Production(Build)
```bush
npm run build
// copy *.html and dist to nginx
// replace index_prod.html to index.html in nginx
```

