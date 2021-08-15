const data = {
    alarm: {
        time: Date.now() + 30 * 60000,
        fading: 20 * 60000,
        status: 'off',
    },
    sleepTimer: {
        time: 30 * 60000,
        startTime: Date.now(),
        fading: 10 * 60000,
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

const middleWare = {
    alarm: [],
    sleepTimer: [],
    led: [],
}

const registerListener = slice => cb => listener[slice].push(cb);
const registerMiddleWare = slice => cb => middleWare[slice].push(cb);

const handler = slice => ({
    get: (obj, prop) => {
        if (prop === 'subscribe') {
            return registerListener(slice)
        }
        if (prop === "use") {
            return registerMiddleWare(slice)
        }

        return obj[prop]
    },
    set: (obj, prop, value) => {
        if (obj[prop] !== value) {
            let current = value;
            middleWare[slice].forEach(cb => current = cb({ prop, value, current, obj }));
            obj[prop] = current ?? value;
            listener[slice].forEach(cb => cb({ prop, value: current, obj }));
        }
    }
});

const proxys = {};
Object.keys(data).forEach(key => proxys[key] = new Proxy(data[key], handler(key)));

module.exports = proxys