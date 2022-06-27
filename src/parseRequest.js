const parseValue = value => {
  return value.replace(/\+/g, ' ');
};

const parseUri = rawUri => {
  const queryParams = {};
  const [uri, paramsString] = rawUri.split('?');
  if (!paramsString) {
    return { uri, queryParams };
  }

  const params = paramsString.split('&');
  params.forEach(paramString => {
    const [param, value] = paramString.split('=');
    queryParams[param] = parseValue(value);
  });
  return { uri, queryParams };
};

const parseRequestLine = (line) => {
  const [method, rawUri, httpVersion] = line.split(' ');
  const uri = parseUri(rawUri);
  return { method, ...uri, httpVersion };
};

const parseHeaders = lines => {
  let index = 0;
  const headers = {};
  while (index < lines.length && lines[index].length > 0) {
    const [header, ...value] = lines[index].split(':');
    headers[header.trim()] = value.join(':').trim();
    index++;
  }
  return headers;
};

const parseRequest = (chunk) => {
  const lines = chunk.split('\r\n');
  const requestLine = parseRequestLine(lines[0]);
  const headers = parseHeaders(lines.slice(1));
  return { headers, ...requestLine };
};

module.exports = { parseRequest, parseRequestLine, parseHeaders };
