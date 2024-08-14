const md5 = require('md5');
const path = require("path");

module.exports = {
  generateFilePath(uploadPath, fileName) {
    const md5Hash = md5(fileName);
    const subfolder = md5Hash.slice(-2);
    return path.join(uploadPath, subfolder, fileName);
  }
}