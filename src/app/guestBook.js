class GuestBook {
  #comments;
  #id;
  constructor(comments, id) {
    this.#comments = comments;
    this.#id = id;
  };

  addComment(rawComment) {
    const { name, comment } = rawComment;
    if (!name || !comment) {
      return;
    }
    rawComment.date = new Date().toString();
    rawComment.id = this.#id++;
    this.#comments.unshift(rawComment);
    return rawComment;
  };

  toString() {
    return JSON.stringify(this.#comments);
  }
};

module.exports = { GuestBook };
