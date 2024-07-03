import React, { useEffect, useState } from 'react'
// import { Navbar } from 'react-bootstrap'
import Navbar from "../Widgets/Navbar"
import { store, db } from '../Config/Firebase'


export default function FindFriends() {

  var loginUserId = localStorage.getItem("UserID")
  const [users, setUsers] = useState([])
  var data = []

  // get all user without login id
  const getUsers = async () => {
    await store.collection("users").where("userID", "!=", loginUserId).get()
      .then((snap) => {

        snap.forEach(async (doc) => {
          // console.log(doc.id, "=>", doc.data());

          doc.data["send_status"] = false
          data.push(doc.data())
        })

      })
      .catch((e) => {
        console.log(e);
      })


    var senderRequest = []
    // get all user which have sent a request to me
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
    console.log(allRequest);

    const filterdata = data.filter((user) => {
      console.log(user.userID);
      console.log(loginUserId);
      return !allRequest.some(
        request =>
          (request.SenderID == loginUserId && request.ReceiverID == user.userID) ||
          (request.SenderID == user.userID && request.ReceiverID == loginUserId)
      )
    })

    // console.log(filterdata);
    setUsers(filterdata)

  }

  const sendRequest = async (index) => {
    console.log(users[index]);


    var id = localStorage.getItem("UserID")
    var name = localStorage.getItem("Name")
    var email = localStorage.getItem("Email")
    var proimage = localStorage.getItem("Profileimage")

    // generate dynamic request id
    var key = db.ref("users").push().key

    var obj = {
      "SenderID": id,
      "Sendername": name,
      "Senderemail": email,
      "Senderimgae": proimage,
      "ReceiverID": users[index]["userID"],
      "Receivername": users[index]["userName"],
      "Receiveremail": users[index]["userEmail"],
      "Receiverimage": users[index]["ProfileImage"],
      "RequestId": key,
      "Requeststatus": "Pending"
    }

    console.log(obj);
    await store.collection("Requests").doc(key).set(obj)
      .then((snap) => {
        alert("Request send")
        users[index]["send_status"] = true
        users[index]["RequestID"] = key
        // var updatedData = users.filter((_, i) => i != index)
        console.log(users);
      })
      .catch((e) => {
        console.log(e);
      })

    setUsers([...users])
    console.log(users);


  }

  const cancelRequest = async (index) => {
    // console.log(index);
    // users[index]["send_status"] = "false"
    await store.collection("Requests").doc(users[index]["RequestID"]).delete()
      .then((snap) => {
        alert("delete request successfully");
        users[index]["send_status"] = false
        users[index]["RequestID"] = ""
      })
      .catch((e) => {
        console.log(e);
      })

    setUsers([...users])
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Filter friends button */}
      <div className="container-fluid py-2 text-center" style={{ backgroundColor: "gray" }}>
        <button className='btn btn-success'>All Friends</button>
        <button className='btn btn-warning ms-3'>Pending Requests</button>
      </div>

      {/* Friends or users */}
      <div className="container-fluid">
        <div className="row">

          {
            users.map((value, index) => {
              return (
                <div className="col-md-4 col-sm-6 col-12 p-md-2 p-lg-5 p-3">
                  <div class="card p-3" style={{ boxShadow: " 9px 12px 24px -8px rgba(117,117,117,1)" }}>
                    <img src={value.ProfileImage} class="card-img-top" alt="..." />
                    <div class="card-body">
                      <h5 class="card-title">{value.userName}</h5>
                      {
                        value.send_status ?
                          <a href="#" class="btn btn-primary" onClick={() => cancelRequest(index)}>Cancel Request</a> :
                          <a href="#" class="btn btn-primary" onClick={() => sendRequest(index)}>Add Friend</a>
                      }
                      <a href="#" class="btn btn-danger ms-2">Delete</a>
                    </div>
                  </div>
                </div>
              )


            })
          }
        </div>
      </div>



    </div>
  )
}

