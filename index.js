const autoLoad = require('./easyD')
const c = autoLoad('./modules');

//Start Express-Server
const { app, server } = c.setup

//Endpoints
app.use('/api', c.api);

//Start Alarm-Clock
const clock = c.clock;

server();
