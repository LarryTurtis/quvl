import React, { Component, PropTypes } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import CreateReport from '../../components/CreateReport';
import './PublisherApp.styl';

class PublisherApp extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  static stateToProps = state => ({
    user: state.auth.user
  })

  render() {
    const { user } = this.props;
    return (
      <div className="publisher-app">
        <Header user={user} />
        <Sidebar />
        <main>
          <CreateReport />
          This is the publisher app.
        </main>
        <Footer />
      </div>
    );
  }
}

export default PublisherApp;
