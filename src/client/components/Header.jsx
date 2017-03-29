import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import connect from '../util/connect';

class Header extends Component {

  static propTypes = {
    push: PropTypes.func
  }

  static actionsToProps = {
    push
  }

  handleLogOut = () => {
    this.props.push('/login');
  };

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand" href="#quvl">QUVL</a>
          </div>
          <div className="navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a href="/">Home</a></li>
              <li><a href="/newdoc">New Document</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
            <form className="navbar-form navbar-left" />
            <ul className="nav navbar-nav navbar-right">
              {/* <% if (loggedIn) { %>
                        <li><a href="/logout">Log out</a></li>
                    <% } else { %>
                        <li><a href="/signup">Sign up</a></li>
                        <li><a href="/login">Log in</a></li>
                    <% } %> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

}

export default connect(Header);
