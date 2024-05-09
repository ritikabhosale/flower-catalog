const { createApp } = require("../src/app.js");
const request = require("supertest");

describe("GET /guest-book", () => {
  const appConfig = {
    staticDir: "./static",
    guestBook: {},
  };

  it("should serve guest book", (done) => {
    appConfig.guestBook.getComments = () => {
      return [
        {
          id: "1",
          body: "comment",
          createdAt: "",
        },
      ];
    };
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };
    const req = request(createApp(appConfig, sessions, () => {}));
    req.get("/guest-book").set("cookie", "sessionId=1").expect(200, done);
  });

  it("should redirect to home page", (done) => {
    const req = request(createApp(appConfig, {}, () => {}));
    req.get("/guest-book").expect("location", "/login").expect(302, done);
  });
});

describe("POST /guest-book", () => {
  const appConfig = { staticDir: "./static", guestBook: {} };

  it("should redirect to login page", (done) => {
    const req = request(createApp(appConfig, {}, () => {}));
    req
      .post("/comment")
      .expect("location", "/login")
      .send("name=abc&comment=something")
      .expect(302, done);
  });

  it("should save the comment and redirect to guest book page", (done) => {
    appConfig.guestBook.addComment = () => {};
    const sessions = { 1: { sessionId: "1", username: "a@b.c", time: "12" } };

    const req = request(createApp(appConfig, sessions, () => {}));
    req
      .post("/comment")
      .set("cookie", "sessionId=1")
      .expect("location", "/guest-book")
      .send("name=abc&comment=something")
      .expect(302, done);
  });
});
