const createIo = ({['socket.io']: socketIo, store}) => server => {
    const io = socketIo(server);

    store.led.subscribe((prop, value, obj) => {
        io.emit('led', obj)
    })
    store.alarm.subscribe((prop, value, obj) => {
        io.emit('alarm', obj)
    })
    store.sleepTimer.subscribe((prop, value, obj) => {
        io.emit('sleepTimer', obj)
    })

    return io;
}

module.exports = createIo;