const clock = function({alarm, sleepTimer}) {
    return setInterval(() => {
         alarm.timer();
         sleepTimer.timer();
    }, 5000);
}

module.exports = clock