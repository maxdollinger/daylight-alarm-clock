const c = require('./easyD')(['./modules', './utils']);
const {app, server} = c.setup

server();
