class GuestBook {
  #comments;
  #latestId;
  constructor(comments) {
    this.#comments = comments;
    this.#latestId = this.#getLatestId();
  };

  #getLatestId() {
    if (this.#comments.length === 0) {
      return 1;
    }
    return this.#comments[0].id + 1;
  }

  addComment(rawComment) {
    const { name, comment } = rawComment;
    if (!name || !comment) {
      return;
    }
    rawComment.date = new Date().toString();
    rawComment.id = this.#latestId;
    this.#latestId++;
    this.#comments.unshift(rawComment);
    return rawComment;
  };

  toJSON() {
    return JSON.stringify(this.#comments);
  }
};

module.exports = { GuestBook };
