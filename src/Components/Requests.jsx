import React, { useEffect, useState } from 'react'
import Navbar from "../Widgets/Navbar"
import { store, db } from '../Config/Firebase'
import { useNavigate } from 'react-router'


export default function Requests() {

  const nav = useNavigate()

  const [request, setRequest] = useState([])
  const [id, setID] = useState()


  useEffect(() => {
    const loginUserId = localStorage.getItem("UserID")
    setID(loginUserId)

    const getAllRequests = async () => {
      var senderRequest = []
      await store.collection("Requests").where("SenderID", "==", loginUserId).get()
        .then((snap) => {
          snap.forEach((doc) => {
            console.log(doc);
            console.log(doc.data());
            senderRequest.push(doc.data())
          })
        })


      var ReceiverRequest = []
      // get all user that i have send a request
      await store.collection("Requests").where("ReceiverID", "==", loginUserId).get()
        .then((snap) => {
          snap.forEach((doc) => {
            console.log(doc);
            console.log(doc.data());
            ReceiverRequest.push(doc.data())
          })
        })

      var allRequest = [...senderRequest, ...ReceiverRequest]
      setRequest(allRequest)
    }

    getAllRequests()
  }, [])


  const acceptRequest = async (index) => {
    // console.log(request[index]);
    var userData = request[index]

    var roomId = db.ref("Conversion").push().key;
    
    request[index]["loading"] = true
    setRequest([...request])

    await store.collection("Conversation").doc(roomId).set({
      Receiveremail: userData["Receiveremail"],
      Receiverimage: userData["Receiverimage"],
      Receivername: userData["Receivername"],
      RequestId: userData["RequestId"],
      SenderID: userData["SenderID"],
      Senderemail: userData["Senderemail"],
      Senderimgae: userData["Senderimgae"],
      Sendername: userData["Sendername"],
      roomId
    })

    await store.collection("Requests").doc(request[index]["RequestId"]).update({
      Requeststatus: "Accepted",
      roomId
    })

    request[index]["Requeststatus"] = "Accepted"
    request[index]["RoomID"] = roomId
    console.log(request[index]);
    setRequest([...request])

  }

  const navigateToChat=(index)=>{
    console.log("Hello");
    console.log(request[index]["roomId"]);
  }

  return (
    <div>
      <Navbar />
      {
        request.map((v, index) => {
          return (
            <>
              <div class="card m-2" style={{ border: "2px solid black" }}>

                <div class="card-body d-flex justify-content-between bg-info rounded">
                  <h5 class="card-title"> <h1>{v.SenderID == id ? v.Receivername : v.Sendername}</h1></h5>
                  <p class="card-text">
                    {
                      v.SenderID == id ?
                        <h4> {v.Requeststatus == "Pending" ? `Status : ${v.Requeststatus}` : <button onClick={()=>navigateToChat(index)} className='btn btn-success'>Chat</button>}</h4> : null
                    }

                      
                    {
                      v.SenderID != id && v.Requeststatus == "Pending" && v.loading == null?
                        <button className='btn btn-primary' onClick={() => acceptRequest(index)}>Accept</button> :
                        v.SenderID != id && v.Requeststatus == "Pending" && v.loading != null ? 
                        <h4>Loading...</h4> : null
                    }

                    {/* {
                      v.SenderID != id && v.Requeststatus == "Pending"?
                        <button className='btn btn-primary' onClick={() => acceptRequest(index)}>Accept</button> : null} */
                    }



                    {
                      v.SenderID != id && v.Requeststatus == "Accepted" ? <button className='btn btn-success' onClick={()=>navigateToChat(index)}>Chat</button> : null
                    }</p>

                </div>





              </div>

            </>

          )
        })
      }
    </div>
  )
}   
