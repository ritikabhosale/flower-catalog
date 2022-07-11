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

const updateRows = (xhr) => {
  const comments = JSON.parse(xhr.response);
  const tbody = document.querySelector('tbody');
  tbody.innerText = '';
  comments.forEach((comment) => updateRow(comment, tbody));
};

const createXHR = ({ method, url, params }, onload) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = (event) => {
    if (xhr.status === 200) {
      onload(xhr, event);
      return;
    }
    console.log('Request failed');
  };
  xhr.send(params);
};

const updateTable = (xhr) => {
  const request = { method: 'GET', url: '/api/comments' };
  createXHR(request, updateRows);
};

const addComment = () => {
  const bodyParams = getBodyParams('form');
  const request = { url: '/guest-book', method: 'POST', params: bodyParams };
  createXHR(request, updateTable);
};

window.onload = addComment;
