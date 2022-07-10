const getBodyParams = (selector) => {
  const form = document.querySelector(selector);
  return new URLSearchParams(new FormData(form));
};

const drawElement = (elementName, innerText, parentElement) => {
  const element = document.createElement(elementName);
  element.innerText = innerText;
  parentElement.appendChild(element);
};

const addCommentHTML = (xhr) => {
  const { name, date, comment } = JSON.parse(xhr.response);
  const tr = document.createElement('tr');
  drawElement('td', date, tr);
  drawElement('td', name, tr);
  drawElement('td', comment, tr);
  const heading = document.getElementById('heading');
  heading.insertAdjacentElement('afterend', tr);
};

const addComment = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/guest-book');
  const bodyParams = getBodyParams('form');
  xhr.onload = () => addCommentHTML(xhr);
  xhr.send(bodyParams);
};

window.onload = addComment;
