const sleepTimer = ({led, store}) => {
    const data = store.sleepTimer;

    const setTime = time => {
        data.status = 'on';
        time < 0 && (time = 0);
        time > 90*60000 && (time = 90*60000);
        data.startTime = Date.now() + time - data.fading;
        data.time = time;
        return data;
    }
    
    const toggle = () =>{
        data.status === 'off' ? setTime(data.time) : data.status = 'off';

        return data;
    }
    
    const timer = () => {
        if (data.status === "on" && data.startTime <= Date.now()) {
            data.status = 'pending';
            console.log(`${(new Date()).toLocaleString('de-DE')} => sleep squence started`);
            const iv = setInterval(() => {
                if(data.status === 'off') {
                    clearInterval(iv);
                    console.log(`${(new Date()).toLocaleString('de-DE')} => sleep squence stopped (turned off)`);
                } else if (led.pwm(val => --val) === 0) {
                    clearInterval(iv);
                    data.status = 'off';
                    console.log(`${(new Date()).toLocaleString('de-DE')} => sleep squence stopped (led off)`);
                }
            }, (data.fading / 255))
    
        }
    };

    return {
        get: () => data,
        post: ({time}) => setTime(time),
        put: toggle,
        timer,
    }
}

module.exports = sleepTimer