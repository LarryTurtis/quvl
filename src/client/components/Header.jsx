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
    let rightLinks;
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
        <NavDropdown title="Workshops" id="workshops">
          <LinkContainer to="/dashboard"><MenuItem>Upcoming</MenuItem></LinkContainer>
          <LinkContainer to="/workshops"><MenuItem>Calendar</MenuItem></LinkContainer>
        </NavDropdown>
      </Nav>);

    if (!this.props.user) {
      leftLinks = null;
    }

    if (this.props.user) {
      rightLinks = (
        <Nav bsStyle="pills" className="navbar-right">
          <NavItem onClick={this.handleLogout}>
            Log out
          </NavItem>
          <Navbar.Header>
            <Navbar.Brand>
              <img alt="" className="media-object" src={this.props.user.picture} />
            </Navbar.Brand>
          </Navbar.Header>
        </Nav >);
    }

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
            <Link to="/dashboard" className="navbar-brand">QUVL</Link>
          </Navbar.Brand>
        </Navbar.Header>
        {leftLinks}
        {rightLinks}
      </Navbar>
    );
  }

}

export default connect(Header);
