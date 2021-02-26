const fs = require('fs');

const externalDependencies = {
    utils: require('./utils/utils.js'),
    express: require('express'),
}

const modules = {}

module.exports = function ({ path, fileEnding }) {
    const dir = fs.opendirSync(path);

    while ((entrie = dir.readSync()) !== null) {
        const key = entrie.name.replace(fileEnding, '');
        modules[key] = require(`./modules/${entrie.name}`);
    }
    dir.closeSync();

    const loadDependencies = (key, mod) => {
        if(!(mod instanceof Function)) {
            console.log(`...${key} already loaded`);
            return;
        }
        console.log(`loading ${key}...`);

        const fn = mod().fn;
        const md = mod().dependencies;
        let dependencies = {};

        if(md instanceof Array) {
            md.forEach( key => dependencies[key] = key)
        } else {
            dependencies = md;
        }

        for (const [key, value] of Object.entries(dependencies)) {
            if(!value) {
                dependencies[key] = key;
            }
            if(value && typeof value === 'string') {
                dependencies[value] = key;
            }
        }

        for (const [key, value] of Object.entries(dependencies)) {
            if(value instanceof Object) continue;

            if (modules.hasOwnProperty(value)) {
                dependencies[key] = modules[value] instanceof Function ? loadDependencies(value, modules[value]) : modules[value];
            } else {
                dependencies[key] = externalDependencies[value];
            }
        }

        modules[key] = fn(dependencies);
        console.log(`...${key} loaded`)
    }

    for (const [key, mod] of Object.entries(modules)) {
        loadDependencies(key, modules[key])
    }

    return modules
}