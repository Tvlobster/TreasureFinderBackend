const socketIo = require('socket.io');
let io = null;

//This initalizes the socket for the webserver.
//This allows the server to send the users of the apps notifications.
exports.initialize = function(server) {
    io = socketIo(server);
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

//returns the instance of the io
exports.getIo = function() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
