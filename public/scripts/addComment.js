const getBodyParams = (selector) => {
  let inputs = [];
  const form = document.querySelector(selector);
  const fields = new FormData(form).entries();
  for (const [name, value] of fields) {
    inputs.push(name + '=' + value);
  }
  return inputs.join('&');
};

const addComment = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/guest-book');
  const bodyParams = getBodyParams('form');
  xhr.send(bodyParams);
};

window.onload = addComment;
