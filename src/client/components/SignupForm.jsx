import React, { Component, PropTypes } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { replace } from 'react-router-redux';
import connect from '../util/connect';
import Callout from '../components/Callout';
import { doSignup } from '../actions/login';

const FAIL = 'Login Failure.';
const SUCCESS = 'Login Success.';

class SignupForm extends Component {

  static propTypes = {
    doSignup: PropTypes.func,
    login: PropTypes.object,
    replace: PropTypes.func
  };

  static actionsToProps = {
    doSignup,
    replace
  };

  static stateToProps = state => ({
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogin = (e) => {
    e.preventDefault();
    this.setState({ callout: false });
    this.props.doSignup(this.state.email, this.state.password)
      .then(user => {
        const type = user.error ? Callout.failure : Callout.success;
        const message = user.error ? FAIL : SUCCESS;
        this.setState({ callout: { type, message } });
        this.props.replace('/dashboard');
      });
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  }

  render() {
    let callout;
    const { login } = this.props;

    if (login.isSending) {
      return <div className="sb-invite-form">Spinner</div>;
    }

    if (this.state.callout) {
      callout = (<Callout
        type={this.state.callout.type}
        message={this.state.callout.message}
      />);
    }

    return (
      <div className="row">
        <div className="col-sm-4" />
        <div className="col-sm-4">
          <h1>Sign Up</h1>
          {callout}
          <form id="loginForm">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input type="email" className="form-control" name="email" placeholder="Email" onChange={this.handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handlePasswordChange} />
            </div>
          </form>
          <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleLogin}>Sign up</button>
          <hr />OR<hr />
          <ButtonToolbar>
            <a href="/auth/facebook" className="btn btn-primary" data-dismiss="modal"><span className="fa fa-facebook" />Sign up with Facebook</a>
            <a href="/auth/google" className="btn btn-danger" data-dismiss="modal"><span className="fa fa-google-plus" />Sign up with Google</a>
          </ButtonToolbar>
          <p>
            By proceeding to create your account and using Quvl, you are agreeing to our <Link to="/tos">Terms of Service and Privacy Policy</Link>. If you do not agree, you cannot use Quvl.
          </p>
        </div>
        <div className="col-sm-4" />
      </div>
    );
  }
}

export default connect(SignupForm);
