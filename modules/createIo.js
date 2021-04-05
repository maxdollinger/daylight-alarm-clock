const createIo = ({['socket.io']: socketIo, store}) => server => {
    const io = socketIo(server);

    store.led.subscribe((prop, value, obj) => {
        io.emit('led', obj)
    })
    store.alarm.subscribe((prop, value, obj) => {
        const {time, status} = obj;
        io.emit('alarm', {time, status})
    })
    store.sleepTimer.subscribe((prop, value, obj) => {
        const {time, status, fading} = obj;
        io.emit('sleepTimer', {time, status, fading})
    })

    return io;
}

module.exports = createIo;