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
      timestamp: new Date(),
      senderDelete : false,
      receiverDelete : false

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

  // delete for every one 
  const deleteForEveryOne=async (messageid)=>{
    await store.collection("Messages").doc(messageid).delete()
    console.log("delete");

  }


  // only delete for me
  const deleteForMe=async (messageid ,sender)=>{
    
    console.log(messageid);
    var updatedata = sender == true ? {
      senderDelete : true
    } : 
    {
      receiverDelete : true
    }
    await store.collection("Messages").doc(messageid).update(updatedata)
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
          <>

         {
          v.senderId == id && v.senderDelete == false ?
          <div key={i}>
            {v.senderId === id ? 
            <>
              <h3 style={{ textAlign: "right", marginTop:"20px", marginBottom: "40px" }}>{v.message }  </h3>  <button className='btn btn-danger' 
              onClick={ v.senderId == id ? ()=>deleteForEveryOne(v.Messagekey) : ()=>{}}  
              style={{float:"right"}}>Delete for every one</button> 
              
              <button className='btn btn-danger' onClick={ v.senderId == id ? ()=>deleteForMe(v.Messagekey ,true) : ()=>deleteForMe(v.Messagekey ,false)}  
              style={{float:"right"}}>Delete for me</button>   <hr  style={{marginTop:"110px"}}/> 
             
              </>: 

              <>
              <h3 style={{ textAlign: "left",marginTop:"20px", marginBottom: "40px" }}> {v.message} </h3>
              <button className='btn btn-danger' onClick={ v.senderId == id ? ()=>deleteForMe(v.Messagekey ,true) : ()=>deleteForMe(v.Messagekey ,false)}  
              style={{float:"left"}}>Delete for me</button> 
                <hr  style={{marginTop:"100px"}}/>
                   </>}
          </div>
          :
          v.senderId != id && v.receiverDelete == false ?
          <div key={i}>
          {v.senderId === id ? 
          <>
            <h3 style={{ textAlign: "right", marginTop:"20px", marginBottom: "40px" }}>{v.message }  </h3>  <button className='btn btn-danger' 
            onClick={ v.senderId == id ? ()=>deleteForEveryOne(v.Messagekey) : ()=>{}}  
            style={{float:"right"}}>Delete for every one</button> 
            
            <button className='btn btn-danger' onClick={ v.senderId == id ? ()=>deleteForMe(v.Messagekey ,true) : ()=>deleteForMe(v.Messagekey ,false)}  
            style={{float:"right"}}>Delete for me</button>   <hr  style={{marginTop:"110px"}}/> 
           
            </>: 

            <>
            <h3 style={{ textAlign: "left",marginTop:"20px", marginBottom: "40px" }}> {v.message} </h3>
            <button className='btn btn-danger' onClick={ v.senderId == id ? ()=>deleteForMe(v.Messagekey ,true) : ()=>deleteForMe(v.Messagekey ,false)}  
            style={{float:"left"}}>Delete for me</button> 
              <hr  style={{marginTop:"100px"}}/>
                 </>}
        </div>
        :
        <></>
         }
         </>
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
