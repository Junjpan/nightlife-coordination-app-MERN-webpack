const express=require('express');
const app=express();
const port=process.env.PORT||5000;
const Mongoose=require('mongoose');
const Member=require('./routes/memberRoute');
const Search=require('./routes/searchRoute');
const Bar=require('./routes/barRoute');
const bodyParser=require('body-parser');
const cors=require('cors');
const socket=require('socket.io');
const path=require('path');

require('dotenv').config();
app.use(bodyParser.json());
app.use(cors())
Mongoose.connect(process.env.URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log('connected to MongoDB...')
})

app.use('/api/business',Search);
app.use('/api/member',Member);
app.use('/api/bar',Bar);

//if(process.env.NODE_ENV==='production'){
  
    app.use(express.static(path.join(__dirname,"client/build")));
    app.get('*',(req,res)=>{
       res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })

//}

const server=app.listen(port,function(){
    console.log('listen on port '+port)
})

//set up socket
var io=socket(server);
io.on('connect',(socket)=>{
//var clients=io.sockets.sockets;
//console.log(Object.keys(clients))//return an array of all connected sockets;

//join chat room
socket.on('join room',(data)=>{
    var room=data.room;
    var clientsInRoom=io.sockets.adapter.rooms[room]; //it will be undefined when there are no people create the room
    var numInRoom=clientsInRoom===undefined?0:clientsInRoom.length
    socket.join(room);
    const joinmessage={
        user:"system",
        message:`${data.user} just joined the chat room.total ${numInRoom+1} person in the room`
    }
    io.to(room).emit('join room',joinmessage)
})

//receive chat message
socket.on('chatmessage',(data)=>{
    io.to(data.room).emit("chatmessage",data)
})

//client leave the chat room
socket.on('leave room',(data)=>{    
const    numInRoom=io.sockets.adapter.rooms[data.room]
    const leavemessage={
        user:"system",
        message:`${data.user} just left the chat room.total ${numInRoom.length-1} person in the room`
    }
    socket.leave(data.room);
    io.to(data.room).emit('leave room',leavemessage)
})
})