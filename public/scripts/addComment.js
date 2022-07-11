const getBodyParams = (selector) => {
  const form = document.querySelector(selector);
  return new URLSearchParams(new FormData(form));
};

const updateField = (elementName, innerText, parentElement) => {
  const element = document.createElement(elementName);
  element.innerText = innerText;
  parentElement.appendChild(element);
};

const updateRow = ({ name, date, comment }, parentElement) => {
  const tr = document.createElement('tr');
  updateField('td', date, tr);
  updateField('td', name, tr);
  updateField('td', comment, tr);
  parentElement.appendChild(tr);
};

const updateTable = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/comments');
  xhr.onload = () => {
    const comments = JSON.parse(xhr.response);
    const tbody = document.querySelector('tbody');
    tbody.innerText = '';
    comments.forEach((comment) => updateRow(comment, tbody));
  };
  xhr.send();
};

const addComment = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/guest-book');
  const bodyParams = getBodyParams('form');
  xhr.onload = () => updateTable();
  xhr.send(bodyParams);
};

window.onload = addComment;
