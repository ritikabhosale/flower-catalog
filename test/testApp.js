const { createApp } = require("../src/app.js");
const request = require("supertest");
const assert = require("assert");

const mockConsoleLog = (...expectedText) => {
  return (...actualText) => {
    assert.deepEqual(actualText, expectedText);
  };
};

describe("GET /abc", () => {
  it("should route to not found on /abc ", (done) => {
    const appConfig = { staticDir: "./public" };
    const mockedConsoleLog = mockConsoleLog("GET", "/abc");
    const req = request(createApp(appConfig, {}, {}, mockedConsoleLog));
    req
      .get("/abc")
      .expect(404, "/abc not Found", done)
      .expect("content-type", /plainn/);
  });
});

describe("GET /", () => {
  it("should send static content", (done) => {
    const appConfig = { staticDir: "./public" };
    const mockedConsoleLog = mockConsoleLog("GET", "/");
    const req = request(createApp(appConfig, {}, {}, mockedConsoleLog));
    req
      .get("/")
      .expect(200, done)
      .expect("content-type", /html/)
      .expect("content-length", "835");
  });
});
