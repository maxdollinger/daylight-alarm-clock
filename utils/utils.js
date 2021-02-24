exports.currentTimeString = () => {
     const currentTime = new Date(Date.now());
     return `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
}

const crypto = require("crypto");

exports.randomHexString = (length = 16) => {
  const chars = "0123456789abcdef";
  let str = [];

  crypto.randomBytes(length).forEach((el) => {
    const number = Math.round(el * ((chars.length - 1) / 256));
    str.push(chars[number]);
  });

  return str.join("");
}

exports.routErr = fn => (req, res, next) => {
     try {
          fn(req, res, next);
     } catch(err) {
          res.msg = err.message;
          res.data = err.stack;
          next();
     }
}