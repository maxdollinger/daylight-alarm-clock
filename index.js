const autoLoad = require('./easyD')
const c = autoLoad('./modules');

const { app, server } = c.setup

//Start Alarm-Clock
const clock = c.clock;

//Endpoints
app.use('/api', c.api);

//Start Express-Server
const http = server();

//Register socket.io
const io = c.createIo(http);