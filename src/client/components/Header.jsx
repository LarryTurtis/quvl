import React, { Component, PropTypes } from 'react';
import { Navbar, NavDropdown, Nav, NavItem, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { LinkContainer } from 'react-router-bootstrap';
import connect from '../util/connect';
import { doLogout } from '../actions/login';
import './Header.styl';

class Header extends Component {

  static propTypes = {
    user: PropTypes.object,
    doLogout: PropTypes.func
  }

  static actionsToProps = {
    doLogout
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogout = () => {
    this.props.doLogout()
      .then(() => {
        push('/');
      });
  }

  render() {
    let leftLinks = (
      <Nav bsStyle="pills">
        <NavDropdown title="Documents" id="documents">
          <LinkContainer to="/mydocs"><MenuItem>My Documents</MenuItem></LinkContainer>
          <LinkContainer to="/newdoc"><MenuItem>New Document</MenuItem></LinkContainer>
        </NavDropdown>
        <NavDropdown title="Groups" id="groups">
          <LinkContainer to="/groups"><MenuItem>My Groups</MenuItem></LinkContainer>
          <LinkContainer to="/newgroup"><MenuItem>New Group</MenuItem></LinkContainer>
        </NavDropdown>
        <LinkContainer to="/workshops"><NavItem>Workshop Calendar</NavItem></LinkContainer>
      </Nav>);

    if (!this.props.user) {
      leftLinks = null;
    }

    let rightLinks = (
      <Nav bsStyle="pills" className="navbar-right">
        <LinkContainer onClick={this.handleLogout}><NavItem>Log out</NavItem></LinkContainer>
      </Nav>);

    if (!this.props.user) {
      rightLinks = (
        <Nav pullRight bsStyle="pills">
          <LinkContainer to="/signup"><NavItem>Sign up</NavItem></LinkContainer>
          <LinkContainer to="/login"><NavItem>Log in</NavItem></LinkContainer>
        </Nav>
      );
    }

    return (
      <Navbar className="qv-header">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className="navbar-brand">QUVL</Link>
          </Navbar.Brand>
        </Navbar.Header>
        {leftLinks}
        {rightLinks}
      </Navbar>
    );
  }

}

export default connect(Header);
