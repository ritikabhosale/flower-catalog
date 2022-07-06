const parseCookies = cookiesAsString => {
  const cookies = {};
  if (cookiesAsString) {
    cookiesAsString.split(';').forEach(cookieAsString => {
      const [name, value] = cookieAsString.split('=');
      cookies[name] = value;
    });
  }
  return cookies;
};

const injectCookies = (request, response, next) => {
  const cookiesAsString = request.headers.cookie;
  const cookies = parseCookies(cookiesAsString);
  request.cookies = cookies;
  next();
};

const createSession = sessionId => {
  return { sessionId, date: new Date().toLocaleString() };
};

const injectSession = sessions => (request, response, next) => {
  const { sessionId } = request.cookies;
  if (sessionId) {
    request.session = sessionId;
  }
  next();
  return;
};

const login = sessions => (request, response, next) => {
  let { pathname } = request.url;
  if (pathname === '/login') {
    const { sessionId } = request.cookies;
    if (!sessionId) {
      const newId = new Date().getTime();
      response.setHeader('set-cookie', 'sessionId=' + newId);
      const session = createSession(newId);
      sessions[newId] = session;
      response.end('Logged in successfully');
      return;
    }
    response.end('You are already logged in.');
    return;
  }
  next();
};

module.exports = { login, injectCookies, injectSession };
