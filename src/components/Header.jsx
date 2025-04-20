import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
    const location = useLocation();
    const currentPath = location.pathname;

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
                        <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
                            <Link
                                to="/"
                                className={`me-4 nav-link-custom ${currentPath === '/' ? 'active-link' : ''}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                className={`me-4 nav-link-custom ${currentPath === '/products' ? 'active-link' : ''}`}
                            >
                                Products
                            </Link>
                        </Nav>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


export default Header;
