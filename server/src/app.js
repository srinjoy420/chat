import express from "express"
import dotenv from "dotenv"
import { Server } from "socket.io"
import { createServer } from "http"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

import cors from "cors"

dotenv.config()


const app = express()
const PORT = process.env.PORT || 8000
const secret = "hihellokamombolo"
const server = createServer(app)
app.use(cookieParser())
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT"],
        credentials: true

    }
})
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true

}))


app.get("/", (req, res) => {
    res.json({ status: "sucess" })
})
app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "fffsss" }, secret)
    res.cookie("token", token, { httpOnly: true, secure: false }).json({ message: "login succcsfully" })
})
const user = false
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err)
        const token = socket.request.cookies.token
        if (!token) return next(new Error("authentication error"))
        const decode = jwt.verify(token, secret)
        if (!decode) return next(new Error("authentication error"))
        next()


    })
    

})
//ioconnection 
io.on("connection", (socket) => {
    console.log("user connected", socket.id);


    // socket.emit("welcome",`hello i am learning the socket ${socket.id}`)
    // socket.broadcast.emit("welcome",`hello i am learning the socket ${socket.id}`)
    //message
    // socket.on("message",(data)=>{
    //     console.log(data);
    //     // io.emit("recived",data)
    //     socket.broadcast.emit("recived",data) // i dont get the  message but all do

    // })
    //for personal message
    socket.on("message", ({ room, message }) => {
        console.log(room, message);
        // io.emit("recived",data)
        io.to(room).emit("recived", message) // i dont get the  message but all do

    })
    //for the join room name
    socket.on("join-room", (roomName) => {
        console.log("the room name is ", roomName);
        socket.join(roomName)

    })

    /// disconnect
    //      socket.on("disconnect", (reason) => {
    //     console.log("User disconnected", socket.id, "Reason:", reason);
    //   });

})

server.listen(PORT, () => {
    console.log(`app is running on port:${PORT}`);

})