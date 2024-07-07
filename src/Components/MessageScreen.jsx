import React, { useState, useEffect } from 'react'
import { store, db } from '../Config/Firebase'
import Navbar from '../Widgets/Navbar'
import { onSnapshot } from 'firebase/firestore';

export default function MessageScreen() {

  const [id, setID] = useState("")
  const [roomiD, setRoomId] = useState("")
  const [text, setText] = useState("")
  const [roomData, setroomData] = useState([])
  const [message, setMessage] = useState([])
  const [ConversationID, setConversationID] = useState()

  useEffect(() => {
    getRoomData()
  }, [])

  const getRoomData = async () => {
    var userID = localStorage.getItem("UserID")
    setID(userID)
    var roomid = localStorage.getItem("roomID")
    setRoomId(roomid)
    var data = []

    await store.collection("Conversation").doc(roomid).get()
      .then((snap) => {
        data.push(snap.data())
      })
      .catch((e) => {
        console.log(e);
      })

    setroomData([...data]);
  }

  const sendMessage = async () => {
    var messagekey = db.ref("Messages").push().key;

    var Message = {
      message: text,
      senderId: id,
      receiverID: roomData[0]["SenderID"] === id ? roomData[0]["Receiverid"] : roomData[0]["SenderID"],
      roomid: roomData[0]["roomId"],
      Messagekey: messagekey,
      timestamp: new Date()
    }

    await store.collection("Messages").doc(messagekey).set(Message)
      .then(() => {
        // alert("Message sent successfully")
        setText("")
      })
      .catch((e) => {
        console.log("Error in sending a message", e);
      })
  }

  useEffect(() => {
    var conid = localStorage.getItem("roomID")
    setConversationID(conid)

    const unsubscribe = store.collection("Messages").where("roomid", "==", roomiD)
      .onSnapshot((snapshot) => {
        const newMessage = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessage(newMessage);
      })

    return () => unsubscribe();
  }, [roomiD])

  return (
    <>
      <Navbar />
      <div className="container" >
        {Array.isArray(message) && message.map((v, i) => (
          <div key={i}>
            {v.senderId === id ? 
              <h3 style={{ textAlign: "right", marginBottom: "80px" }}>{v.message} <hr /> </h3> : 
              <h3 style={{ textAlign: "left", marginBottom: "80px" }}>{v.message} <hr /> </h3>}
          </div>
        ))}
      </div>
      <div className="container-fluid bg-secondary position-fixed bottom-0 py-md-3 ps-md-5 py-2">
        <div className="row">
          <div className="col-lg-11 col-md-10 col-sm-8 col-10">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className='form-control' />
          </div>
          <div className="col-lg-1 col-md-1 col-sm-1 col-2">
            <button className='btn btn-primary' onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  )
}
