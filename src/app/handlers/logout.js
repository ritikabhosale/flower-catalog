const logout = sessions => (request, response) => {
  const { sessionId } = request.session;
  delete sessions[sessionId];
  response.clearCookie('sessionId');
  response.redirect('/');
  response.end();
  return;
};

module.exports = { logout };
