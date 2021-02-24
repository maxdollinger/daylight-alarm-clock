const createDeffinition = require("./maxState");

const alarmScheme = {
    time: {
        default: Date.now() + 30 * 60000,
    },
    fading: {
        default: 20 * 60 * 1000,
    },
    status: {
        default: 'off',
        validate: val => ['on', 'off', 'pending'].includes(val),
    }
}

const alarmDeff = createDeffinition('alarm', alarmScheme);

const isTimeInPast = (time) => {
    return (time - alarmDeff.get().fading) < Date.now()
}

alarmDeff.createListener('time', (val, _, state) => state.status = 'on');
alarmDeff.createListener('time', (time, _, state) =>{
    if (isTimeInPast(time)) {
        time += 1000 * 60 * 60 * 24;
        time -= time % (1000 * 60);
        state.time = time
    }
})

alarmDeff.createHandler('getTimeString', (val, state) => (new Date(state.time)).toString());
alarmDeff.createHandler('alarmTimer', (led, alarm) => {
    if (alarm.status === "on" && isTimeInPast(alarm.time)) {
        alarm.status = 'pending';
        console.log(`wake up squence started: ${alarmDeff.getTimeString()}`);
        const iv = setInterval(() => {
            if(alarm.status === 'off') {
                led.brightness = 0;
                clearInterval(iv);
            }
            if (led.brightness >= 255) {
                alarm.status = 'off';
                clearInterval(iv);
            }

            led.brightness += 1;
        }, (alarm.fading / 255))

    }
});

module.exports = alarmDeff;