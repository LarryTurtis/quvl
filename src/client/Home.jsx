import React, { Component, PropTypes } from 'react';
import connect from './util/connect';
import Dashboard from './components/Dashboard';
import Splash from './components/Splash';

class Home extends Component {

  static propTypes = {
    login: PropTypes.object
  };

  static stateToProps = state => ({
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let home;
    if (!this.props.login && this.props.login.user) {
      home = <Dashboard />;
    }
    else {
      home = <Splash />;
    }
    return home;
  }
}

export default connect(Home);
