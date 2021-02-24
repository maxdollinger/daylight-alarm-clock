const store = {};

const getState = cb => {
    const data = {};

    for (const [key, values] of Object.entries(store)) {
        data[key] = values.data;
    }

    Object.freeze(data);

    return cb(data);
}

const createListener = (listenTo, cb, proxy, getState) => (emitter, newValue, oldValue) => {
    if (listenTo === emitter) return cb(newValue, oldValue, proxy, getState)
}

const dataHandler = deffStore => {
    const { data, fn, listener } = deffStore;

    const setValue = (obj, prop, value) => {
        if (obj.hasOwnProperty(prop)) {
            if (value !== obj[prop] && fn[prop].validate(value)) {
                if (value instanceof Object) Object.freeze(value);
                const oldValue = obj[prop];
                obj[prop] = value;

                listener.forEach(func => {
                    func(prop, obj[prop], oldValue);
                })

                return true;
            }
        } else {
            return false;
        }
    }

    const activateListener = (obj, prop, value) => {
        
    }

    return {
        get: (obj, prop) => {
            if (obj.hasOwnProperty(prop)) {
                return obj[prop]
            }
        },
        set: (obj, prop, value) => {
            if (setValue(obj, prop, value)) {
                activateListener(obj, prop, value);
            }
        }
    }
}

const deffHandler = (deffStore, dataProxy) => {
    const { fn, data } = deffStore;

    return {
        get: (obj, prop) => {
            if (obj.hasOwnProperty(prop)) {
                return obj[prop];
            }
            if (data.hasOwnProperty(prop)) {
                return dataProxy[prop];
            }
            if (fn.hasOwnProperty(prop)) {
                return fn[prop];
            }
        },
        set: (obj, prop, value) => dataProxy[prop] = value
    }
}

const createDeffinition = (name, deff) => {
    if (store.hasOwnProperty(name)) return store[name].proxy;
    store[name] = {};
    const data = store[name].data = {};
    const fn = store[name].fn = {};
    const listener = store[name].listener = [];

    for (const [key, value] of Object.entries(deff)) {
        data[key] = {};
        data[key] = value.default !== undefined ? value.default : null;
        fn[key] = {};
        fn[key].validate = value.validate || (val => true);
    }

    const dataProxy = new Proxy(data, dataHandler(store[name]))

    const generalFn = {
        createListener: (listenTo, cb) => {
            listener.push(createListener(listenTo, cb, dataProxy, getState));
        },
        createHandler: (name, cb) => {
            if (!fn.hasOwnProperty(name) && !data.hasOwnProperty(name)) {
                fn[name] = value => cb(value, dataProxy, getState);
            }
        },
        get: () => getState(state => state[name]),
        getState: getState,
    }

    const proxy = store[name].proxy = new Proxy(generalFn, deffHandler(store[name], dataProxy))
    Object.freeze(proxy);

    return proxy
}

module.exports = createDeffinition;