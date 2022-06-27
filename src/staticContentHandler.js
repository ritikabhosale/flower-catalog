const fs = require('fs');

const mimeTypes = {
  img: 'image/png',
  html: 'text/html',
  jpg: 'image/jpg',
  css: 'text/css'
};

const getMimeType = (fileName) => {
  const extension = fileName.slice(fileName.lastIndexOf('.') + 1);
  return mimeTypes[extension];
};

const serveFileContent = (request, response) => {
  let { uri } = request;
  uri = uri === '/' ? '/index.html' : uri;
  const fileName = './public' + uri;

  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', getMimeType(fileName));
    response.send(content);
    return true;
  }
  return false;
};

module.exports = { serveFileContent };
