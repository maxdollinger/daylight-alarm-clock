const container = {};

const service = (name, cb) => {
    if (container.hasOwnProperty(name)) {
        return false;
    } else {
        console.log(`=> ${name} registered`);
        container[name] = cb;
    }
}
const dependencies = (obj) => {
    let str = '=== Dependecies ===\n';
    Object.keys(obj).forEach(key => str += ` |_> ${key}\n`)
    return str;
}
const handler = ({
    get: (obj, prop) => {
        if (prop === 'service') {
            return service;
        }
        if(prop === 'dependencies') {
            return dependencies(obj)
        }
        if (!obj.hasOwnProperty(prop)) {
            const dep = require(prop);
            obj[prop] = () => dep;
            console.log(`=> ${prop} registered`);
        }
        return obj[prop](c);
    }
})

const c = new Proxy(container, handler)

const autoLoad = (paths, c) => {
    const load = path => {
        const dir = c.fs.opendirSync(path);

        while ((entrie = dir.readSync()) !== null) {
            if (entrie.name.includes('.test')) continue;

            const module = require(`${path}/${entrie.name}`)
            const name = module.name ? module.name : entrie.name.split('.')[0];

            if (module instanceof Function) {
                c.service(name, c => {
                    return module(c)
                });
            } else {
                c.service(name, () => {
                    return module;
                })
            }
        }
        dir.closeSync();
    }

    if (Array.isArray(paths)) {
        paths.forEach(path => load(path));
    } else if (typeof paths === 'string') {
        load(paths);
    }
}

module.exports = (config) => {
    autoLoad(config, c);
    return c;
}