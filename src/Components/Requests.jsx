import React, { useEffect, useState } from 'react'
import Navbar from "../Widgets/Navbar"
import { store } from '../Config/Firebase'


export default function Requests() {
    const [request ,setRequest] = useState([])
    const [id , setID] = useState()
    var loginUserId = localStorage.getItem("UserID")
    setID(loginUserId)

    const getAllRequests=async ()=>{
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

    useEffect(()=>{
        getAllRequests()
    },[])

  return (
    <div>
      <Navbar />
      <h1>Get all requests</h1>
      {
        request.map((v,i)=>{
          return(
           <>
           <h1>{ v.SenderID == id ? v.Receivername : v.Sendername}</h1>

            {
              v.SenderID == id ? 
              <h3>Status : {v.Requeststatus}</h3> : null
            }

            {
              v.SenderID != id ? 
              <button>Accept</button> : null
            }
           </>

          )
        })
      }
    </div>
  )
}   
