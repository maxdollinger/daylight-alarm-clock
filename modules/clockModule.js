const dependencies = ['alarm', 'sleepTimer'];

const clock = function({alarm, sleepTimer}) {
    return setInterval(() => {
         alarm.alarmTimer();
         sleepTimer.sleepTimer();
    }, 5000);
}

module.exports = () => ({
    dependencies,
    fn: clock,
})