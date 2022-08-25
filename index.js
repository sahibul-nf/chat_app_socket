const express = require("express");
const {
    createServer
} = require("http");
const {
    Server
} = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
});

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})


io.on('connection', socket => {
    //Get the chatID of the user and join in a room of the same chatID
    chatID = socket.handshake.query.chatID
    socket.join(chatID)
    
    console.log(socket.rooms); // Set { <socket.id>, "room1" }

    // console.log(socket.id)

    //Leave the room if the user closes the socket
    socket.on('disconnect', () => {
        socket.leave(chatID)
    })

    //listens for new messages coming in
    socket.on('message', function name(data) {
        console.log(data);
        io.emit('message', data);
    })

    //Send message to only a particular user
    socket.on('send_message', message => {
        receiverChatID = message.receiverID
        senderChatID = message.senderID
        content = message.content

        //Send message to only that particular room
        socket.to(receiverChatID).emit('receive', {
            'content': content,
            'senderID': senderChatID,
            'receiverID': receiverChatID,
        })

    })

    // socket.emit('reply', {
    //     'content': content,
    //     'senderChatID': senderChatID,
    //     'receiverChatID': receiverChatID,
    // })

    // //Send message private
    // io.to(chatID).emit('private', {
    //     'chatID': chatID,
    //     'content': content,
    //     'senderChatID': senderChatID,
    //     'receiverChatID': receiverChatID,
    // })
});

var port = process.env.PORT || 3000;
httpServer.listen(port, function (err) {
    if (err) console.log(err);
    console.log('Listening on port', port);
})