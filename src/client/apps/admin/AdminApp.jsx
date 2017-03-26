import React, { Component, PropTypes } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InviteUser from '../../components/InviteUser';
import CreateReport from '../../components/CreateReport';
import './AdminApp.styl';

class AdminApp extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  static stateToProps = state => ({
    user: state.auth.user
  })

  render() {
    const { user } = this.props;
    return (
      <div className="admin-app">
        <Header user={user} />
        <section>
          <InviteUser />
          <CreateReport />
        </section>
        <Footer />
      </div>
    );
  }
}

export default AdminApp;
