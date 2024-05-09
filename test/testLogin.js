const { createApp } = require("../src/app.js");
const request = require("supertest");

describe("GET /login", () => {
  it("should serve login page", (done) => {
    const appConfig = { staticDir: "./public" };
    const req = request(createApp(appConfig, {}, () => {}));
    req.get("/login").expect(200, done);
  });

  it("should redirect to home page when already logged in", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const appConfig = { staticDir: "./public" };
    const req = request(createApp(appConfig, sessions, () => {}));
    req.get("/login").set("Cookie", "sessionId=1").expect(302, done);
  });
});

describe("POST /login", () => {
  const sessions = { 1: { sessionId: "1", username: "abc", time: "12" } };
  const appConfig = {
    staticDir: "./public",
    userStore: {},
  };

  it("should post the details", (done) => {
    appConfig.userStore.authenticate = () => true;
    appConfig.userStore.getUser = () => {
      return { id: "1", name: "abc" };
    };

    const req = request(createApp(appConfig, sessions, () => {}));
    req
      .post("/login")
      .send("email=abc@gmail.com&password=abc12")
      .expect(302, done)
      .expect("location", "/guest-book");
  });

  it("should send json in case of invalid username or password", (done) => {
    appConfig.userStore.authenticate = () => false;
    const req = request(createApp(appConfig, sessions, () => {}));
    const status = { success: false, message: "Invalid credentials" };
    req
      .post("/login")
      .send("email=abc@gmail.com&password=abc1")
      .expect(422, JSON.stringify(status), done);
  });

  it("should redirect to home page when logged in", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const req = request(createApp(appConfig, sessions, () => {}));
    req
      .post("/login")
      .set("Cookie", ["sessionId=1"])
      .expect(302, done)
      .expect("location", "/");
  });

  it("should send message when mandatory fields are empty", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const status = { success: false, message: "All fields required" };

    const req = request(createApp(appConfig, sessions, () => {}));
    req.post("/login").expect(400, JSON.stringify(status), done);
  });
});
