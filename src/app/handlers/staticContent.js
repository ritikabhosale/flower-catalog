const fs = require('fs');
const path = require('node:path');

const serveFileContent = serveFrom => (request, response) => {
  let { pathname } = request.url;
  pathname = pathname === '/' ? '/index.html' : pathname;
  const fileName = path.join(serveFrom, pathname);

  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.end(content);
    return true;
  }
  return false;
};

module.exports = { serveFileContent };
