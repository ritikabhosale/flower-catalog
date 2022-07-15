const logout = sessions => (request, response) => {
  const { sessionId } = request.session;
  delete sessions[sessionId];
  response.clearCookie('sessionId');
  response.redirect('/');
  return;
};

module.exports = { logout };
