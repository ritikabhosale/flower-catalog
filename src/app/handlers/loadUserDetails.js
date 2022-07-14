const fs = require('fs');

const loadUserDetails = detailsFile => {
  const details = JSON.parse(fs.readFileSync(detailsFile, 'utf8'));
  return (request, response, next) => {
    request.usersInfo = details;
    request.saveUserInfo = (details) => {
      fs.writeFileSync(detailsFile, JSON.stringify(details), 'utf8');
    };
    next();
    return;
  };
};

module.exports = { loadUserDetails };
