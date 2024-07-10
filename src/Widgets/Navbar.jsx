import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Ensure this CSS is imported
import { useNavigate } from 'react-router'



export default function NavbarCom() {

    const nav  = useNavigate()

    const logout = () => {
        nav("/")
        // alert("ok")
        localStorage.clear();
        toast.success("Logout Successful", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        localStorage.clear()
        
    }

    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <Navbar bg="primary" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/Home">Chatting App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto me-auto">
                            <Nav.Link as={Link} to="/Home" className="text-white">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/FindFriends" className="text-white">
                                Find Friends
                            </Nav.Link>
                            <Nav.Link as={Link} to="/Requests" className="text-white">
                                Requests
                            </Nav.Link>
                            <Nav.Link as={Link} to="/MessageScreen" className="text-white">
                                Messages
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            
                                <button onClick={()=>logout()} className="btn btn-success">Logout</button>
                        
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
