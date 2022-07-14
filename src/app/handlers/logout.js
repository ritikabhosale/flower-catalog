const logout = sessions => (request, response) => {
  const { sessionId } = request.session;
  delete sessions[sessionId];
  delete request.session;
  response.clearCookie('sessionId');
  response.redirect('/');
  response.end();
  return;
};

module.exports = { logout };
