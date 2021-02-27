const data = {
    time: 30*60000,
    startTime: Date.now(),
    fading: 10*60000,
    status: 'off',
}

const sleepTimer = ({led}) => {
    const setTime = time => {
        data.status = 'on';
        time < 0 && (time = 0);
        time > 90*60000 && (time = 90*60000);
        data.startTime = Date.now() + time - data.fading;
        return data.time = time;
    }
    
    const toggle = () =>{
        if(data.status === 'off') {
            setTime(data.time);
            return data.status;
        } else {
            return data.status = 'off';
        }
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
    
    const get = () => {
        const obj = {...data};
        return Object.freeze(obj);
    }

    return {
        get,
        post: ({time}) => setTime(time),
        put: toggle,
        timer,
    }
}

module.exports = sleepTimer