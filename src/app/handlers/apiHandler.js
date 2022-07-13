const fs = require('fs');
const filterRecords = (comments, name) => {
  return comments.filter(comment => comment.name === name);
};

const toString = comments => JSON.stringify(comments);

const serveFilteredRecords = (request, response, dataFile) => {
  const { name } = toSearchParams(request.url.searchParams);
  fs.readFile(dataFile, (err, content) => {
    const comments = JSON.parse(content);
    const filteredRecords = filterRecords(comments, name);
    response.setHeader('content-type', 'text/json');
    response.end(toString(filteredRecords));
  });
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
  fs.readFile(dataFile, (err, content) => {
    const comments = JSON.parse(content);
    const commentsFrequency = getCommentsFrequency(comments);
    response.setHeader('content-type', 'text/json');
    response.end(toString(commentsFrequency));
  });
  return;
};

const queryPresent = ({ searchParams }) => {
  return Object.keys(searchParams).length !== 0;
};

const handleQuery = (request, response, dataFile) => {
  const { q } = toSearchParams(request.searchParams);
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
  fs.readFile(dataFile, (err, content) => {
    const comments = JSON.parse(content);
    response.setHeader('content-type', 'text/json');
    response.end(toString(comments));
  });
  return;
};

module.exports = { serveComments };
