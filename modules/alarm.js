const data = {
    time: Date.now() + 30 * 60000,
    fading: 20*60000,
    status: 'off',
}

const alarm = ({led, utils}) => {
    const isTimeInPast = (time) => {
        return (time - data.fading) < Date.now()
    }
    
    const setTime = time => {
        data.status = 'on';
        if (isTimeInPast(time)) {
            time += 1000 * 60 * 60 * 24;
        }
        time -= time % (1000 * 60);
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
        if (data.status === "on" && isTimeInPast(data.time)) {
            data.status = 'pending';
            console.log(`${utils.formateTime()}: alarm squence started`);
            const iv = setInterval(() => {
                if (data.status === 'off') {
                    clearInterval(iv);
                    led.pwm(0);
                    console.log(`${utils.formateTime()}: alarm squence stopped (turned off)`);
                } else if (led.pwm(val => ++val) === 100) {
                    clearInterval(iv);
                    data.status = 'off';
                    console.log(`${utils.formateTime()}: alarm squence stopped (led 100%)`);
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

module.exports = alarm