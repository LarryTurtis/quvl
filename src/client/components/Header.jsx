import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Button } from '@blueprintjs/core';
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
      <header>
        <nav className="pt-navbar pt-fixed-top pt-dark">
          <div className="pt-navbar-group pt-align-left">
            <span className="pt-navbar-heading">ServerBid</span>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <Button className="pt-minimal" iconName="cog" />
            <Button className="pt-minimal" iconName="log-out" onClick={this.handleLogOut} />
          </div>
        </nav>
      </header>
    );
  }

}

export default connect(Header);
