const EOL = '\r\n';

const statusCodeMessage = {
  200: 'OK',
  400: 'NOT FOUND'
};

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  #writeHeaders() {
    Object.entries(this.#headers).forEach(([header, value]) =>
      this.#socket.write(`${header}: ${value}${EOL}`));
  }

  setHeader(header, value) {
    this.#headers[header] = value;
  }

  #statusMessage() {
    return statusCodeMessage[this.#statusCode];
  }

  send(body) {
    this.setHeader('content-length', body.length);
    const status = `${this.#statusCode} ${this.#statusMessage()}`;
    const response = `HTTP/1.1 ${status} ${EOL}`;
    this.#socket.write(response);
    this.#writeHeaders();
    this.#socket.write(EOL);
    this.#socket.write(body);
    this.#socket.end();
  }

  set statusCode(code) {
    this.#statusCode = code;
  }
}

module.exports = { Response };
