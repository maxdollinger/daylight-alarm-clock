exports.createDaysString = day => {
     const days = {
          1: 'Montag',
          2: 'Dienstag',
          3: 'Mittwoch',
          4: 'Donnerstag',
          5: 'Freitag',
          6: 'Samstag',
          0: 'Sonntag',
     };

     return days[day];
}

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