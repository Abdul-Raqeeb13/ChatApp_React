import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';


export default function NavbarCom() {
    return (
        <div>
            <Navbar bg="primary" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Chatting App</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link>
                            <Link className='text-black text-decoration-none' to={"/Home"}>Home</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link className='text-black text-decoration-none' to={"/FindFriends"}>Find Friends</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link className='text-black text-decoration-none' to={"/Requests"}>Requests</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link className='text-black text-decoration-none' to={"/Friends"}>Friends</Link>
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}
