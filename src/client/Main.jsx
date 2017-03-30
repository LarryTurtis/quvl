import React, { Component, PropTypes } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewDoc from './components/NewDoc';
import DocList from './components/DocList';

import './Main.styl';


class Main extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  static stateToProps = state => ({
    user: state.login.user
  })

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user } = this.props;
    return (
      <div id="wrap">
        <div id="main">
          <Header user={user} />
          <div className="container">
            <NewDoc />
            <DocList />
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Main;
