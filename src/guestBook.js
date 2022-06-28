const fs = require('fs');
const rowTemplate = '<tr><td>_DATE_</td><td>_NAME_</td><td>_COMMENT_</td></tr>';

const commentHTML = ({ name, comment, date }) => {
  return rowTemplate.replace('_DATE_', date).replace('_NAME_', name).replace('_COMMENT_', comment);
};

class GuestBook {
  #comments;
  #template;
  constructor(comments, template) {
    this.#comments = comments;
    this.#template = template;
  };

  addComment(rawComment) {
    const { name, comment } = rawComment;
    if (!name || !comment) {
      return;
    }
    rawComment.date = new Date().toString();
    this.#comments.unshift(rawComment);
  };

  #generateCommentsHTML() {
    let commentsHTML = '';
    this.#comments.forEach(comment => {
      commentsHTML += commentHTML(comment)
    });
    return commentsHTML;
  };

  #readTemplate() {
    return fs.readFileSync(this.#template, 'utf8');
  }

  getComments() {
    return this.#comments;
  }

  generateHTML() {
    const commentsHTML = this.#generateCommentsHTML();
    const template = this.#readTemplate();
    return template.replace('_COMMENTS-LIST_', commentsHTML);
  }
};

module.exports = { GuestBook };
