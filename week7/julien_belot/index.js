const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");


const client = new MongoClient(process.env["mongodb+srv://julienbelot:helloworld@cluster0.x17gj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"]);


const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String }
})

const messageModel = mongoose.model("Message", messageSchema)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on("join", async (chatId) => {
    try {
        let result = await collection.findOne({ "_id": chatId });
        if(!result) {
            await collection.insertOne({ "_id": chatId, messages: [] });
        }
        socket.join(chatId);
        socket.emit("joined", chatId);
        socket.activeRoom = chatId;
    } catch (e) {
        console.error(e);
    }
  });
  socket.on('chat message', function(msg){
    const message = new messageModel();
    message.content = msg;
    message.save().then(m => {
      io.emit('chat message', msg);
    })
  });
});


server.listen(3000, async function(){
  await client.connect()
  //await mongoose.connect("mongodb+srv://julienbelot:helloworld@cluster0.x17gj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  collection = client.db("test").collection("messages")
  console.log('listening on *:3000');
});