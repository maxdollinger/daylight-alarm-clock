const alarm = ({ led, store }) => {
    const data = store.alarm;
    
    const isTimeInPast = (time) => {
        return (time - data.fading) < Date.now()
    }

    const setTime = time => {
        data.status = 'on';
        if (isTimeInPast(time)) {
            time += 1000 * 60 * 60 * 24;
        }
        time -= time % (1000 * 60);
        data.time = time;

        return data;
    }

    const toggle = () => {
        data.status === 'off' ? setTime(data.time) : data.status = 'off';

        return data;
    }

    const timer = () => {
        if (data.status === "on" && isTimeInPast(data.time)) {
            data.status = 'pending';
            console.log(`${(new Date()).toLocaleString('de-DE')} => alarm squence started`);
            const iv = setInterval(() => {
                if (data.status === 'off') {
                    clearInterval(iv);
                    led.pwm(0);
                    console.log(`${(new Date()).toLocaleString('de-DE')} => alarm squence stopped (turned off)`);
                } else if (led.pwm(val => ++val) === 255) {
                    clearInterval(iv);
                    data.status = 'off';
                    console.log(`${(new Date()).toLocaleString('de-DE')} => alarm squence stopped (led 100%)`);
                }
            }, (data.fading / 255))
        }
    };

    return {
        get: () => data,
        post: ({ time }) => setTime(time),
        put: toggle,
        timer,
    }
}

module.exports = alarm