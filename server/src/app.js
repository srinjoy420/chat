import express from "express"
import dotenv from "dotenv"
import {Server} from "socket.io"
import {createServer} from "http"


const app=express()
const server =createServer(app)
const io=new Server(server)

dotenv.config
app.get("/",(req,res)=>{
    res.json({status:"sucess"})
})
//ioconnection 
const PORT=process.env.PORT||8000
app.listen(PORT,()=>{
    console.log(`app is running on port:${PORT}`);
    
})