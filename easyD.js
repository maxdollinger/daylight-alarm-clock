const container = {};

const handler = ({
        get: (obj, prop) => {
            if (prop === 'service') {
                return (name, cb) => container.hasOwnProperty(name) ? false : container[name] = cb;
            }
            if (container.hasOwnProperty(prop)) {
                return container[prop](c);
            } else {
                console.log(`require ${prop}`);
                return require(prop)
            }
        }
    })

const c = new Proxy(container, handler)

const autoLoad = (paths, c) => {
    const load = path => {
        const dir = c.fs.opendirSync(path);

        while ((entrie = dir.readSync()) !== null) {
            const module = require(`${path}/${entrie.name}`)
            if(module instanceof Function) {
                c.service(module.name, c => module(c));
            } else {
                const name = module.name ? module.name : entrie.name.split('.')[0];
                c.service(name, () => module)
            }
        }
        dir.closeSync();
    }

    if(Array.isArray(paths)) {
        paths.forEach( path => load(path));
    } else if(typeof paths === 'string') {
        load(paths);
    }
}

module.exports = (config) => {
    autoLoad(config, c);
    return c;
}