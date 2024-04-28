const { createApp } = require("../src/app.js");
const request = require("supertest");
const assert = require("assert");

const mockReadFileSync = (expectedFile, content, expectedEncoding) => {
  return (fileName, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    return content;
  };
};

const mockWriteFileSync = (expectedFile, expectedContent, expectedEncoding) => {
  return (fileName, content, encoding) => {
    assert.strictEqual(fileName, expectedFile);
    assert.strictEqual(encoding, expectedEncoding);
    assert.deepStrictEqual(content, expectedContent);
    return content;
  };
};

describe("GET /signup", () => {
  const appConfig = { staticDir: "./public" };
  const fs = {
    readFile: () => {},
    readFileSync: mockReadFileSync(
      "./src/app/template/signup.html",
      "Signup Template",
      "utf8"
    ),
  };

  it("should serve signup page", (done) => {
    const req = request(createApp(appConfig, {}, fs, () => {}));
    req.get("/sign-up").expect(200, done);
  });

  it("should redirect to home page when already logged in", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const req = request(createApp(appConfig, sessions, {}, () => {}));
    req
      .post("/sign-up")
      .set("Cookie", ["sessionId=1"])
      .expect(302, done)
      .expect("location", "/");
  });
});

describe("POST /sign-up", () => {
  const appConfig = {
    staticDir: "./public",
    usersDataPath: "./data/userDetails.json",
  };
  const users = {
    "a@g.com": { name: "a", email: "a@g.com", password: "ab", mobNo: "9878" },
  };
  const updatedUsers = {
    "a@g.com": { name: "a", email: "a@g.com", password: "ab", mobNo: "9878" },
    "r@g.c": { name: "r", email: "r@g.c", password: "r", mobNo: "1" },
  };

  const fs = {
    readFileSync: mockReadFileSync(
      "./data/userDetails.json",
      JSON.stringify(users),
      "utf8"
    ),
    writeFileSync: mockWriteFileSync(
      "./data/userDetails.json",
      JSON.stringify(updatedUsers),
      "utf8"
    ),
  };

  it("should persist user details", (done) => {
    const status = { success: true, message: "Sign-up Successful" };
    const req = request(createApp(appConfig, {}, fs, () => {}));
    req
      .post("/sign-up")
      .send("name=r&email=r@g.c&password=r&mobNo=1")
      .expect(200, JSON.stringify(status), done);
  });

  it("should not allow duplicate username", (done) => {
    const req = request(createApp(appConfig, {}, fs, () => {}));
    const status = { success: false, message: "User already exists" };
    req
      .post("/sign-up")
      .send("name=a&email=a@g.com&password=a&mobNo=9")
      .expect(409, status, done)
      .expect("content-type", /json/);
  });

  it("should redirect to home page", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const req = request(createApp(appConfig, sessions, fs, () => {}));
    req.post("/sign-up").set("Cookie", "sessionId=1").expect(302, done);
  });
});
