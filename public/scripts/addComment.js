const getBodyParams = (selector) => {
  const form = document.querySelector(selector);
  return new URLSearchParams(new FormData(form));
};

const updateField = (elementName, innerText, parentElement) => {
  const element = document.createElement(elementName);
  element.innerText = innerText;
  parentElement.appendChild(element);
};

const updateRow = ({ name, date, comment, id }, parentElement) => {
  const tr = document.createElement('tr');
  tr.id = id;
  updateField('td', date, tr);
  updateField('td', name, tr);
  updateField('td', comment, tr);
  parentElement.prepend(tr);
};

const updateRows = id => (xhr) => {
  const comments = JSON.parse(xhr.response);
  const newComments = comments.filter(comment => comment.id > id).reverse();
  const tbody = document.querySelector('tbody');
  newComments.forEach((comment) => updateRow(comment, tbody));
};

const createXHR = ({ method, url, params }, onload) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = (event) => {
    if (xhr.status === 200) {
      onload(xhr, event);
    };
  }
  xhr.send(params);
};

const updateTable = (xhr) => {
  const request = { method: 'GET', url: '/api/comments' };
  let id = 0;
  try {
    id = document.querySelector('tbody tr:first-child').id;
  } catch { }
  createXHR(request, updateRows(id));
};

const addComment = () => {
  const bodyParams = getBodyParams('form');
  const request = { url: '/guest-book', method: 'POST', params: bodyParams };
  createXHR(request, updateTable);
};

window.onload = addComment;
