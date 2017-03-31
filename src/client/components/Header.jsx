import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import connect from '../util/connect';
import { doLogout } from '../actions/login';

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
      <ul className="nav navbar-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/newdoc">New Document</Link></li>
        <li><Link to="/newgroup">New Writing Group</Link></li>
        <li><Link to="/mydocs">My Documents</Link></li>
      </ul>);

    if (!this.props.user) {
      leftLinks = null;
    }

    let rightLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><button className="btn btn-default navbar-btn" onClick={this.handleLogout}>Log out</button></li>
      </ul>);

    if (!this.props.user) {
      rightLinks = (
        <ul className="nav navbar-nav navbar-right">
          <li><Link to="/signup">Sign up</Link></li>
          <li><Link to="/login">Log in</Link></li>
        </ul>
      );
    }

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
            {leftLinks}
            {rightLinks}
          </div>
        </div>
      </nav>
    );
  }

}

export default connect(Header);
