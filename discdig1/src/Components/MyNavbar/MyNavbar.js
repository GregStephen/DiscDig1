import React from 'react';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  NavLink,
} from 'reactstrap';
import PropTypes from 'prop-types';

import './MyNavbar.scss';

class MyNavbar extends React.Component {
  state = {
    isOpen: false,
  }

  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    userObj: PropTypes.object,
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  logMeOut = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  };

  render() {
    const { authorized, userObj } = this.props;
    const { avatar } = userObj;
    const buildNavbar = () => (
      <Nav className="ml-auto" navbar>
        <NavLink className="nav-link" tag={RRNavLink} to={'/home'}>Home</NavLink>
        <NavLink className="nav-link" tag={RRNavLink} to={'/add-album'}>Add Album</NavLink>
        <NavLink className="nav-link" tag={RRNavLink} to={'/subcollections'}>Manage Subcollections</NavLink>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret className="navbar-user-button">
            <img className="navbar-user-image" src={avatar.imgUrl} alt={avatar.name}></img>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag={Link} to='/profile'>
              User Profile
                </DropdownItem>
            <DropdownItem onClick={this.logMeOut}>
              Log Out
                </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    );


    return (
      <div className="MyNavbar">
        {authorized && userObj !== undefined
          ? <Navbar dark color="dark" expand="md">
            <NavbarBrand className="navbar-brand" tag={RRNavLink} to='/home'>DiscDig</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              {buildNavbar()}
            </Collapse>
          </Navbar>
          : <Navbar dark color="dark" expand="md">
            <NavbarBrand className="navbar-brand" tag={RRNavLink} to='/home'>DiscDig</NavbarBrand>
          </Navbar>
        }
      </div>
    );
  }
}

export default MyNavbar;
