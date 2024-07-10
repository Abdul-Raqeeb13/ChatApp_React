import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, store, storage } from '../Config/Firebase';
import { ToastContainer, toast } from "react-toastify";
import firebase from '../Config/Firebase';

export default function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const nav = useNavigate();

  // create user with email and password
  const createAccount = async (email, password) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      // Signed in 
      const user = userCredential.user;
      console.log(user);

      var userdata = {
        userName: name,
        userEmail: email,
        userPassword: password,
        userID: user.uid,
        ProfileImage: imageUrl
      };

      console.log(userdata);

      await store.collection("users").doc(user.uid).set(userdata)
        .then(() => {
          console.log("Document successfully written!");
          toast("account created", {
            position: "top-center",
            autoClose: 5018,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          nav("/SignInform");
          console.log("complete");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    } catch (error) {
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
          userName: user.displayName,
          userEmail: user.email,
          userID: user.uid
        };

        console.log(userdata);

        await store.collection("users").doc(user.uid).set(userdata)
          .then(() => {
            console.log("Document successfully written!");
            toast("account created", {
              position: "top-center",
              autoClose: 5018,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            nav("/SignInform");
            console.log("complete");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });

        nav("/Home");
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAccount(email, password);
  };

  // upload image in firebase storage
  async function imageUpload(e) {
    const file = e.target.files[0];
    const storageRef = storage.ref(`ProfilePics/${Date.now()}_${file.name}`);
    await storageRef.put(file).then((snapshot) => {
      storageRef.getDownloadURL().then((url) => {
        setImageUrl(url);
      })
      .catch((e) => {
        console.log(e);
      });
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

      <h1 className="text-center h2">Signup</h1>
      <div className="container">
        <form onSubmit={handleSubmit} className="max-w-sm mx-5 my-4 border border-primary rounded bg-light p-4">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">UserName</label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              className="form-control"
              placeholder="UserName"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Your email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="form-control"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Your password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="form-control"
              placeholder="********"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">Profile Pic</label>
            <input
              onChange={(e) => imageUpload(e)}
              type="file"
              id="file"
              className="form-control"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
          >
            Submit
          </button>
          <button
            onClick={() => googleSignIn()}
            className="btn btn-outline-primary w-100"
          >
            Sign in with Google
          </button>
          <p className="text-center mt-3">
            Already have an account
            <Link className="text-primary" to={"/SignInForm"}>SignIn</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
