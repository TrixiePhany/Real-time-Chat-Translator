import { Server } from "socket.io";

const io = new ServiceWorker(8001,{
    cors:{
        origin:'*'
    }
})

io.on("connection", (socket) =>{
    socket.emit("welcome", "This is a welcome message to the channel");

    socket.on("msg", (data)=>{
        console.log("msg from client", data)
    })
})