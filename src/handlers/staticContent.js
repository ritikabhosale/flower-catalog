const fs = require('fs');
const path = require('node:path');

const mimeTypes = {
  '.img': 'image/png',
  '.html': 'text/html',
  '.jpg': 'image/jpg',
  '.css': 'text/css',
  '.pdf': 'application/pdf',
  '.gif': 'image/gif'
};

const getMimeType = (fileName) => {
  const extension = path.extname(fileName);
  return mimeTypes[extension];
};

const serveFileContent = (request, response) => {
  let { pathname } = request.url;
  pathname = pathname === '/' ? '/index.html' : pathname;
  const fileName = path.join('./public', pathname);

  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', getMimeType(fileName));
    response.end(content);
    return true;
  }
  return false;
};

module.exports = { serveFileContent, getMimeType };
