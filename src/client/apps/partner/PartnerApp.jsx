import React, { Component, PropTypes } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './PartnerApp.styl';

class PartnerApp extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  static stateToProps = state => ({
    user: state.auth.user
  })

  render() {
    const { user } = this.props;
    return (
      <div className="partner-app">
        <Header user={user} />
        <section>
          Some placeholder content.
        </section>
        <Footer />
      </div>
    );
  }
}

export default PartnerApp;
