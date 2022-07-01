const fs = require('fs');
const { toSearchParams } = require('./guestBookHandler.js');

const filterRecords = (comments, name) => {
  return comments.filter(comment => comment.name === name);
};

const readComments = path => JSON.parse(fs.readFileSync(path, 'utf8'));

const toString = comments => JSON.stringify(comments);

const serveFilteredRecords = (request, response, dataFile) => {
  const { name } = toSearchParams(request.url.searchParams);
  const comments = readComments(dataFile);
  const filteredRecords = filterRecords(comments, name);
  response.setHeader('content-type', 'text/json');
  response.end(toString(filteredRecords));
  return;
};

const getCommentsFrequency = comments => {
  return comments.reduce((frequency, comment) => {
    let occurence = frequency[comment.name] || 0;
    frequency[comment.name] = occurence + 1;
    return frequency;
  }, {});
};

const serveCommentsFrequency = (request, response, dataFile) => {
  const comments = readComments(dataFile);
  const commentsFrequency = getCommentsFrequency(comments);
  response.setHeader('content-type', 'text/json');
  response.end(toString(commentsFrequency));
  return;
};

const queryPresent = (request) => {
  const searchParams = toSearchParams(request.url.searchParams);
  return Object.keys(searchParams).length !== 0;
};

const handleQuery = (request, response, dataFile) => {
  const { q } = toSearchParams(request.url.searchParams);
  switch (q) {
    case 'filter':
      return serveFilteredRecords(request, response, dataFile);
    case 'frequency':
      return serveCommentsFrequency(request, response, dataFile);
  }
  return;
};

const serveComments = dataFile => (request, response, next) => {
  if (queryPresent(request)) {
    return handleQuery(request, response, dataFile);
  }
  const comments = readComments(dataFile);
  response.setHeader('content-type', 'text/json');
  response.end(toString(comments));
  return;
};

module.exports = { serveComments };
