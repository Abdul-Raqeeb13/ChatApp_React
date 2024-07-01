import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth , store } from '../Config/Firebase';
import firebase from '../Config/Firebase';

export default function SignInForm() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const nav = useNavigate()


    const signInUser = async (email, password) => {
        const userCredential = await auth.signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // console.log(user.uid);
                await store.collection("users").doc(user.uid).get()
                .then((snap)=>{
                    // console.log(snap.data()["userID"]);
                    localStorage.setItem("UserID" , user.uid)
                    localStorage.setItem("Name" , snap.data()["userName"])
                    localStorage.setItem("Email" , email)
                    localStorage.setItem("Profileimage" ,snap.data()["ProfileImage"])

                    // console.log("complete");

                })
                nav("/Home")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("invalid info")
            });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signInUser(email, password);
    };

    return (
        <div>
            <h1 class="text-center h2">Signin</h1>
            <div className="container">
                <form onSubmit={handleSubmit} class="max-w-sm mx-5 my-4 border border-primary rounded bg-light p-4">
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
                            required
                        />
                    </div>

                    <button onClick={() => signInUser()}
                        type="submit"
                        class="btn btn-primary w-100 mb-2"
                    >
                        Submit
                    </button>
                    <p class="text-center mt-3">
                        Don't have an account
                        <Link class="text-primary" to={"/"}>Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
