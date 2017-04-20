import React, { Component, PropTypes } from 'react';
import { Navbar, NavDropdown, Nav, NavItem, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
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
          <MenuItem><Link to="/mydocs">My Documents</Link></MenuItem>
          <MenuItem><Link to="/newdoc">New Document</Link></MenuItem>
        </NavDropdown>
        <NavDropdown title="Groups" id="groups">
          <MenuItem><Link to="/groups">My Groups</Link></MenuItem>
          <MenuItem><Link to="/newgroup">New Group</Link></MenuItem>
        </NavDropdown>
        <NavItem><Link to="/workshops">Workshop Calendar</Link></NavItem>
      </Nav>);

    if (!this.props.user) {
      leftLinks = null;
    }

    let rightLinks = (
      <Nav bsStyle="pills" className="navbar-right">
        <NavItem><Link onClick={this.handleLogout}>Log out</Link></NavItem>
      </Nav>);

    if (!this.props.user) {
      rightLinks = (
        <Nav pullRight bsStyle="pills">
          <NavItem><Link to="/signup">Sign up</Link></NavItem>
          <NavItem><Link to="/login">Log in</Link></NavItem>
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
