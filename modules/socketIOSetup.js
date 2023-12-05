const socketIo = require('socket.io');
let io = null;

exports.initialize = function(server) {
    io = socketIo(server);
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

exports.getIo = function() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
