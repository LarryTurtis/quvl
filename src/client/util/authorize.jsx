import React, { Component, PropTypes } from 'react';
import connect from './connect';

export function requireRole(...roles) {
  return (user) => user && user.role && roles.indexOf(user.role) !== -1;
}

export default function authorize(WrappedComponent, userHasAccess) {
  class AuthorizationWrapper extends Component {

    static propTypes = {
      user: PropTypes.object,
      params: PropTypes.object
    };

    static stateToProps = (state) => ({
      user: state.auth.user
    });

    render() {
      const { user, params } = this.props;
      if (params.userid !== user.id || !userHasAccess(this.props.user)) {
        return <div>You do not have access to this page.</div>;
      }
      return <WrappedComponent {...this.props} />;
    }

  }

  return connect(AuthorizationWrapper);
}
