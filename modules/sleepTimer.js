const data = {
    time: 30*60000,
    startTime: Date.now(),
    fading: 10*60000,
    status: 'off',
}

const sleepTimer = ({led, utils}) => {
    const setTime = time => {
        data.status = 'on';
        time < data.fading && (time = data.fading);
        time > 90*60000 && (time = 90*60000);
        const startTime = Date.now() + time - data.fading;
        data.startTime = startTime < Date.now() ? Date.now() : startTime;
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
            console.log(`${utils.formateTime()}: sleep squence started`);
            const iv = setInterval(() => {
                if(data.status === 'off') {
                    clearInterval(iv);
                    console.log(`${utils.formateTime()}: sleep squence stoped (turned off)`);
                } else if (led.pwm(val => --val) === 0) {
                    clearInterval(iv);
                    data.status = 'off';
                    console.log(`${utils.formateTime()}: sleep squence stoped (led off)`);
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