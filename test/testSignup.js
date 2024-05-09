const { createApp } = require("../src/app.js");
const request = require("supertest");

describe("GET /signup", () => {
  const appConfig = { staticDir: "./public" };

  it("should serve signup page", (done) => {
    const req = request(createApp(appConfig, {}, () => {}));
    req.get("/sign-up").expect(200, done);
  });

  it("should redirect to home page when already logged in", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const req = request(createApp(appConfig, sessions, () => {}));
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
    userStore: {},
  };

  it("should persist user details and redirect to login", (done) => {
    appConfig.userStore.doesUserExist = () => false;
    appConfig.userStore.saveUser = () => {};

    const req = request(createApp(appConfig, {}, () => {}));

    req
      .post("/sign-up")
      .send("name=r&email=r@g.c&password=r&mobNo=1")
      .expect(302, done)
      .expect("location", "/login");
  });

  it("should not allow duplicate username", (done) => {
    appConfig.userStore.doesUserExist = () => true;

    const req = request(createApp(appConfig, {}, () => {}));
    const status = { success: false, message: "User already exists" };

    req
      .post("/sign-up")
      .send("name=a&email=a@g.com&password=a&mobNo=9")
      .expect(409, status, done)
      .expect("content-type", /json/);
  });

  it("should redirect to home page", (done) => {
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };

    const req = request(createApp(appConfig, sessions, () => {}));

    req.post("/sign-up").set("Cookie", "sessionId=1").expect(302, done);
  });
});
