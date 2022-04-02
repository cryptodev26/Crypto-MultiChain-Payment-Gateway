import React, {Component} from 'react';
import {Container, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import NavLink from 'react-bootstrap/NavLink';
class TopNav extends Component {
    render () {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">USDC Payment system test project</Navbar.Brand>
                </Container>
            </Navbar>
        );
    }
}

export default TopNav;