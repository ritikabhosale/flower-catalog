const addComment = (guestBook) => async (request, response) => {
  const { body, session } = request;
  if (!session) {
    response.redirect("/login");
    return;
  }

  body.userId = session.userId;
  await guestBook.addComment(body);
  response.redirect("/guest-book");
};

const serveGuestBook = (guestBook) => async (request, response) => {
  if (!request.session) {
    response.redirect("/login");
    return;
  }

  const userName = request.session.userName;

  const comments = await guestBook.getComments();

  response.render("guest-book", {
    _USERNAME_: userName,
    _COMMENTS_: comments.map((comment) => {
      return {
        id: comment.id,
        comment: comment.body,
        date: comment.created_at,
        name: userName,
      };
    }),
  });

  return;
};

module.exports = { serveGuestBook, addComment };
