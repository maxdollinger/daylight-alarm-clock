const fs = require('fs');

const dir = fs.opendirSync('./modules');
const modules = {};
while((entrie = dir.readSync()) !== null) {
    const key = entrie.name.replace('.js', '');
    modules[key] = require(`./modules/${key}`)
}
dir.closeSync();

console.log(modules.alarmModule.arguments);