const data = {
    alarm: {
        time: Date.now() + 30 * 60000,
        fading: 20*60000,
        status: 'off',
    },
    sleepTimer: {
        time: 30*60000,
        startTime: Date.now(),
        fading: 10*60000,
        status: 'off',
    },
    led: {
        pwm: 0,
    },
}

const listener = {
    alarm: [],
    sleepTimer: [],
    led: [],
};

const createListener = slice => cb => listener[slice].push(cb);

const handler = slice => ({
    get: (obj, prop) => {
        if(prop === 'subscribe') {
            return createListener(slice)
        }
        return obj[prop]
    },
    set: (obj, prop, value) => {
        if(obj[prop] !== value) {
            obj[prop] = value;
            listener[slice].forEach( cb => cb(prop, value, obj));
        }

    }
});

const proxys = {};
Object.keys(data).forEach( key => proxys[key] = new Proxy(data[key], handler(key)));

module.exports = proxys