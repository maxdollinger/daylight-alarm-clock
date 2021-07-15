const { container, autoLoad } = require('./easyD');

//pigpio mock for development
if(process.env.NODE_ENV !== 'production') {
    container.service('pigpio', () => ({
        Gpio: function () {
            return {
                pwmWrite: val => console.log(val)
            }
        }
    }));
}

//Load all modules
autoLoad(container, './modules');

//Setup ExpressServer
const { app, server } = container.setup

//Start Alarm-Clock
const clock = container.clock;

//Use external push Button
const button = container.button;

//Endpoints
app.use('/api', container.api);

//Start Express-Server
const http = server();

//Register socket.io
const io = container.createIo(http);