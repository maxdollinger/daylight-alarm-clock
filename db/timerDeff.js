const createDeffinition = require("./maxState");

const timer = {
    time: {
        default: 30,
    },
    startTime: {
        default: Date.now() + 30 * 60000
    },
    fading: {
        default: 10*60000,
    },
    status: {
        default: 'off',
        validate: val => ['on', 'off', 'pending'].includes(val),
    }
}

const timerDeff = createDeffinition('timer', timer);

timerDeff.createListener('status', (val, _, state) => val === 'on' && (state.startTime = Date.now() + state.time * 60000));
timerDeff.createListener('time', (val, _, state) => state.status = 'on');
timerDeff.createListener('time', (val, _, state) => state.startTime = Date.now() + val * 60000);

timerDeff.createHandler('getTimeString', (val, state) => (new Date(state.startTime)).toString());
timerDeff.createHandler('sleepTimer', (led, state) => {
    if (state.status === "on" && state.startTime <= Date.now()) {
        state.status = 'pending';
        console.log(`sleep squence started: ${timerDeff.getTimeString()}`);
        const iv = setInterval(() => {
            if(state.status === 'off') {
                clearInterval(iv);
            }
            if (led.brightness <= 0) {
                state.status = 'off';
                clearInterval(iv);
            }

            led.brightness--;
        }, (state.fading / 255))

    }
});

module.exports = timerDeff;