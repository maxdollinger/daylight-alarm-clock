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