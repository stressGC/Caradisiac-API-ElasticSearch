import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Button,
  NavItem,
 } from 'reactstrap';

  import banner from './banner.png';


  export default class Example extends React.Component {
    constructor(props) {
      super(props);

      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
    render() {
      return (
        <div>
        <Navbar color="faded" style={{backgroundColor: '#3366cc', position: 'fixed', width:'100%'}} light expand="md">
        <NavbarBrand href="/"><img src={banner} alt="Smiley face" height="120"/></NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>

        <NavItem>
        <Button href="https://github.com/Sh0ri/caradisiac">Github</Button>
        </NavItem>
        <NavItem>
        Click on any column in the table thead to order the table by this element
        </NavItem>
        <NavItem>
        Click on any row in the table to open a window to it's Caradisiac page
        </NavItem>
        </Nav>
        </Collapse>
        </Navbar>
        </div>
        );
    }
  }

  export {Example};