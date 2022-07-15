const filterRecords = (comments, name) => {
  return comments.filter(comment => comment.name === name);
};

const serveFilteredRecords = ({ query }, response, guestBook) => {
  const { name } = query;
  const comments = JSON.parse(guestBook.toJSON());
  const filteredRecords = filterRecords(comments, name);
  response.json(filteredRecords);
  return;
};

const getCommentsFrequency = comments => {
  return comments.reduce((frequency, comment) => {
    let occurence = frequency[comment.name] || 0;
    frequency[comment.name] = occurence + 1;
    return frequency;
  }, {});
};

const serveCommentsFrequency = (request, response, guestBook) => {
  const comments = JSON.parse(guestBook.toJSON());
  const commentsFrequency = getCommentsFrequency(comments);
  response.json(commentsFrequency);
  return;
};

const queryPresent = ({ query }) => {
  return Object.keys(query).length !== 0;
};

const handleQuery = (request, response, getGuestBook) => {
  const { q } = request.query;
  switch (q) {
    case 'filter':
      return serveFilteredRecords(request, response, getGuestBook);
    case 'frequency':
      return serveCommentsFrequency(request, response, getGuestBook);
  }
  return;
};

const serveComments = guestBook => (request, response) => {
  if (!request.session) {
    response.redirect('/login');
    return;
  }
  if (queryPresent(request)) {
    return handleQuery(request, response, guestBook);
  }
  const comments = JSON.parse(guestBook.toJSON());
  response.json(comments);
  return;
};

module.exports = { serveComments };
