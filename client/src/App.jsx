import React, { use, useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
import { Button, Container, TextField, Typography } from "@mui/material"

const App = () => {
  const socket = useMemo(() => io("http://localhost:8000",{
    withCredentials:true
  }), [])
  const [message, setmessage] = useState("")
  const [room, setRoom] = useState()
  //this is for group room
  const[roomName,setRoomName]=useState("")
  const [soccketId, setSocketid] = useState("")
  const [sms, setsms] = useState("")
  console.log(sms);

  const handelSubmit = (e) => {
    e.preventDefault()
    // socket.emit("message",message)
    socket.emit("message", { message, room })
    setmessage("")

  }
  //for the rooms 
  const handelroom=(e)=>{
     e.preventDefault()
    socket.emit("join-room",roomName)
    //to know that we are join
    setRoomName("")

  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketid(socket.id)
      console.log("connected", socket.id);
      // socket.on("welcome", (s) => {
      //   console.log(s);

      // })
      //the io emit not catcth the data
      socket.on("recived", (data) => {
        console.log(data);
        setsms((sms) => [...sms, data])

      })

    })
    // return () => {
    //   socket.disconnect()
    // }
  }, [])
  return (

    // <for message
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        welcome to soket.io

      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        {soccketId}

      </Typography>


      {/* now for room or group chat */}
      <form onSubmit={handelroom}>
          <h5>Join room</h5>
           <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id="outlined-basic" label="roomname" variant="outlined">

        </TextField>
        <Button type='submit' variant="contained" >
          Join
        </Button>
      </form>

      <form onSubmit={handelSubmit}>
        <TextField value={message} onChange={(e) => setmessage(e.target.value)} id="outlined-basic" label="message" variant="outlined">

        </TextField>
        <TextField value={room} onChange={(e) => setRoom(e.target.value)} id="outlined-basic" label="room" variant="outlined">

        </TextField>
        <Button type='submit' variant="contained" >
          send
        </Button>
      </form>
      <Typography variant="h6" component="div" gutterBottom>
        {sms}

      </Typography>


    </Container>
  )
}

export default App