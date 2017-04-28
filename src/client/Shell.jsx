import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import connect from './util/connect';
import Header from './components/Header';
import Footer from './components/Footer';

import './Main.styl';

class Shell extends Component {

  static propTypes = {
    replace: PropTypes.func,
    user: PropTypes.object,
    children: PropTypes.node
  };

  static stateToProps = (state) => ({
    user: state.login.user
  });

  static actionsToProps = {
    replace
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { user } = this.props;
    this.redirectIfNotAuthenticated(user);
  }

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    this.redirectIfNotAuthenticated(user);
  }

  redirectIfNotAuthenticated(user) {
    if (!user) {
      console.log('No user!')
      this.props.replace('/splash');
    }
  }

  render() {
    return (<div className="shell">
      <Header user={this.props.user} />
      <div id="wrap">
        <div id="main">
          <div className="container">
            {this.props.children}
          </div>
        </div>
      </div>
      <Footer />
    </div>);
  }

}

export default connect(Shell);
