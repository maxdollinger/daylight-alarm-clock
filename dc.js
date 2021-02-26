const container = {};
const services = {};

container.service = (name, cb) => {
    Object.defineProperty(container, name, {
        get: () => {
            if (!services.hasOwnProperty(name)) {
                services[name] = cb(this);
            }

            return services[name];
        },
        configurable: true,
        enumerable: true
    });

    return services;
}

module.exports = container;