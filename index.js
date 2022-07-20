const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const socketIO = new Server(httpServer, { /* options */ });

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})


socketIO.on('connection', socket => {
    //Get the chatID of the user and join in a room of the same chatID
    chatID = socket.handshake.query.chatID
    socket.join(chatID)

    //Leave the room if the user closes the socket
    socket.on('disconnect', () => {
        socket.leave(chatID)
    })

    //listens for new messages coming in
    client.on('message', function name(data) {
        console.log(data);
        socketIO.emit('message', data);
    })

    //Send message to only a particular user
    socket.on('send_message', message => {
        receiverChatID = message.receiverChatID
        senderChatID = message.senderChatID
        content = message.content

        //Send message to only that particular room
        socket.in(receiverChatID).emit('receive_message', {
            'content': content,
            'senderChatID': senderChatID,
            'receiverChatID': receiverChatID,
        })
    })
});

var port = process.env.PORT || 3000;
httpServer.listen(port, function (err) {
    if (err) console.log(err);
    console.log('Listening on port', port);
})