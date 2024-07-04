import React, { useState } from 'react'
import { store , db } from '../Config/Firebase'
import { useEffect } from 'react';
import Navbar from '../Widgets/Navbar'
import { onSnapshot } from 'firebase/firestore';

export default function MessageScreen() {

  const [id, setID] = useState("")
  const [roomiD, setRoomId] = useState("")
  const [text, setText] = useState("")
  const [roomData, setroomData] = useState([])
  const [message, setMessage] = useState([])


  useEffect(() => {
    getRoomData()
  },[])



  const getRoomData = async () => {
    var userID = localStorage.getItem("UserID")
    setID(userID)
    var roomid = localStorage.getItem("roomID")
    setRoomId(roomid)
  var data = []

    await store.collection("Conversation").doc(roomid).get()
      .then((snap) => {
        // console.log(snap.data());
        data.push(snap.data())
      })
      .catch((e) => {
        console.log(e);
      })

      // console.log(roomData[0]);
        setroomData([...data]);

  }

  const sendMessage=async ()=>{
    console.log(text);
    console.log(roomData[0]);

  
    
    var messagekey = db.ref("Messages").push().key;

    var Message = {
      message : text,
      senderId : id,
      receiverID : roomData[0]["SenderID"] == id ? roomData[0]["Receiverid"] :  roomData[0]["SenderID"] ,
      roomid : roomData[0]["roomId"],
      Messagekey : messagekey
    }


    await store.collection("Messages").doc(messagekey).set(
      Message
    )
  }

  useEffect(()=>{
    store.collection("Messages").where("roomid", "==", roomiD)
      .onSnapshot((snapshoot) => {
        const newMessage = snapshoot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(message);
        setMessage(newMessage);
      })

  },[])
  // const getRealTimeMessage=async ()=>{


  
  // }

  return (




    <>
      <Navbar />
      {/* <h1>Thus is message screen</h1> */}

      <div className="container">
        {
          message.map((v , i)=>{
            return(
              <div>
                  {
                    v.senderId == id ? <h1 style={{textAlign:"right", marginBottom:"80px"}}>{v.message} <hr/> </h1> : <h1  style={{textAlign:"left", marginBottom:"80px"}}>{v.message} <hr/> </h1>
                  }
              </div>
             
            )
          })
        }
      </div>

      {/* <div className="container-fluid position-relative bg-success"> */}

      <div className="container-fluid bg-secondary position-fixed bottom-0 py-md-3 ps-md-5 py-2">
        <div className="row">
          {/* <div className="col-md-12"> */}
            <div className="col-lg-11 col-md-10 col-sm-8 col-10">
              <input type="text" value={text} onChange={(e)=>setText(e.target.value)} className='form-control'/>
          </div>
          <div className="col-lg-1 col-md-1 col-sm-1 col-2">
              <button className='btn btn-primary' onClick={()=>sendMessage()}>Send</button>
          {/* </div> */}
          </div>
        </div>
      {/* </div> */}
      </div>


       
      {/* </div> */}
      


    </>
  )
}
