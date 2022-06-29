class GuestBook {
  #comments;
  constructor(comments) {
    this.#comments = comments;
  };

  addComment(rawComment) {
    const { name, comment } = rawComment;
    if (!name || !comment) {
      return;
    }
    rawComment.date = new Date().toString();
    this.#comments.unshift(rawComment);
  };

  toString() {
    return JSON.stringify(this.#comments);
  }
};

module.exports = { GuestBook };
