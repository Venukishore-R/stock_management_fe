import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { FaUser } from "react-icons/fa";
import { useState } from 'react';

function Header() {
    const [activeLink, setActiveLink] = useState('home');

    const handleNavClick = (link) => {
        setActiveLink(link);
    };

    return (
        <Navbar expand="lg" bg="light" className="shadow-sm py-2" style={{ borderBottom: "2px solid #eee", borderRadius: "0 0 10px 10px" }}>
            <Container fluid>
                <Navbar.Brand
                    href="#"
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.6rem",
                        color: "#4B0082",
                        background: "linear-gradient(45deg, #6a0dad, #4B0082)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    StoCKy 📦
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll">
                    <i className="bi bi-list"></i>
                </Navbar.Toggle>

                <Navbar.Collapse id="navbarScroll">
                    <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
                        <Nav.Link
                            href="/"
                            className={`me-4 nav-link-custom ${activeLink === 'home' ? 'active-link' : ''}`}
                            onClick={() => handleNavClick('home')}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            href="/products"
                            className={`me-4 nav-link-custom ${activeLink === 'products' ? 'active-link' : ''}`}
                            onClick={() => handleNavClick('products')}
                        >
                            Products
                        </Nav.Link>
                        {/* <NavDropdown
                            title={<FaUser style={{ fontSize: "1.2rem", color: "#4B0082" }} />}
                            id="navbarScrollingDropdown"
                            align="end"
                            className="ms-3"
                        >
                            <NavDropdown.Item href="#action3">My Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">Logout</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


export default Header;
