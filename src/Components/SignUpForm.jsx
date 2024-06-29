import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth , store  , storage } from '../Config/Firebase';
import { ToastContainer, toast } from "react-toastify";
import firebase from '../Config/Firebase';

export default function Form() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const nav = useNavigate()

  // create user with email and password
  const createAccount = async (email, password) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      // Signed in 
      const user = userCredential.user;
      console.log(user);

      var userdata = {
        userName : name, 
        userEmail : email,
        userPassword : password,
        userID : user.uid,
        ProfileImage : imageUrl 
      }

      console.log(userdata);
      
      await store.collection("users").doc(user.uid).set(userdata)
      .then(() => {
        
          console.log("Document successfully written!");
          toast("account create", {
            position: "top-center",
            autoClose: 5018,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          nav("/SignInform")
          console.log("complete");
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
      });


     


    } catch (error) {
      // console.error("Error code:", error.code);
      // console.error("Error message:", error.message);
      toast(error.message);

    }
  };

  // sign in with google
  const googleSignIn = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {

        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;

        var userdata = {
          userName : user.displayName,
          userEmail : user.email,
          userID : user.uid

        }
        console.log(userdata);
        
        await store.collection("users").doc(user.uid).set(userdata)
        .then(() => {
          
            console.log("Document successfully written!");
            toast("account create", {
              position: "top-center",
              autoClose: 5018,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            nav("/SignInform")
            console.log("complete");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

        
        nav("/Home")


      }).catch((error) => {

        var errorCode = error.code;
        var errorMessage = error.message;

        var email = error.email;

        var credential = error.credential;
        console.log(error)

      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAccount(email, password);
  };

  // upload image in firebase storage
  async function imageUpload(e) {

    var storageRef = storage.ref("Profile Pics")
    await storageRef.put(e.target.files[0]).then((snapshot) => {
      storageRef.getDownloadURL().then((url)=>{
          // console.log(url);
          setimageUrl(url)
      })
      .catch((e)=>{
        console.log(e);
      })
    });
    
  }

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5018}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 class="text-center h2">Signup</h1>
      <div className="container">
        <form onSubmit={handleSubmit} class="max-w-sm mx-5 my-4 border border-primary rounded bg-light p-4">

          <div class="mb-3">
            <label for="name" class="form-label">UserName</label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              class="form-control"
              placeholder="UserName"
              required
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Your email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              class="form-control"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Your password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              class="form-control"
              placeholder="********"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Profile Pic</label>
            <input
              onChange={(e) => imageUpload(e)}
              type="file"
              id="file"
              class="form-control"
              required
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 mb-2"
          >
            Submit
          </button>
          <button
            onClick={() => googleSignIn()}
            class="btn btn-outline-primary w-100"
          >
            Sign in with Google
          </button>
          <p class="text-center mt-3">
            Already have an account
            <Link class="text-primary" to={"/SignInForm"}>SignIn</Link>
          </p>
        </form>
      </div>


    </div>
  );
}
