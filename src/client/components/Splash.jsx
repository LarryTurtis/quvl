import React, { Component, PropTypes } from 'react';
import { Glyphicon, Button, Nav, NavItem, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { push } from 'react-router-redux';
import { checkLogin, doLogin } from '../actions/login';
import connect from '../util/connect';
import './Splash.styl';

class Splash extends Component {

  static propTypes = {
    checkLogin: PropTypes.func,
    doLogin: PropTypes.func,
    user: PropTypes.object,
    push: PropTypes.func,
    seeking: PropTypes.string
  };

  static actionsToProps = {
    checkLogin,
    doLogin,
    push
  };

  static stateToProps = state => ({
    user: state.login
  });

  demoLogin = () => {
    this.props.doLogin('demouser@demo.com', 'gary')
      .then(() => {
        this.props.push('/dashboard');
      });
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.props.checkLogin()
      .then((response) => {
        if (!response.error) {
          this.props.push(props.seeking || '/dashboard');
        }
      });
  }

  render() {
    let splash = null;
    if (!this.props.user.isSending) {
      splash = (
        <div className="qv-splash">
          <Grid fluid>
            <Row className="qv-splash-nav">
              <Nav pullLeft bsStyle="pills">
                <NavItem className="qv-logo">QUVL</NavItem>
              </Nav>
              <Nav pullRight bsStyle="pills">
                <LinkContainer to="/login"><NavItem>Log in</NavItem></LinkContainer>
                <LinkContainer to="/signup"><NavItem>Sign up</NavItem></LinkContainer>
              </Nav>
            </Row>
            <Row className="qv-first">
              <Col sm={6} className="vertical-align qv-jumbo">
                <div>
                  <h1>Quvl makes writing fun.</h1>
                  <p>
                    Quvl enables you to give and receive feedback on
                    your work in a clean, flexible, and rewarding way.
              </p>
                  <p className="qv-tryit"><LinkContainer to="/signup"><Button>Let&#39;s go!</Button></LinkContainer></p>
                </div>
              </Col>
              <Col sm={6} className="book" />
            </Row>
            <Row className="qv-second">
              <div className="h3"><p>Quvl saves every comment in a single document, so reviewing feedback is simple.
            Hide comments from other members, and be sure you&#39;re getting unbiased
            responses to your work.</p></div>
              <p className="qv-tryit"><Button onClick={this.demoLogin}>View Demo Site</Button></p>
            </Row>
            <Row className="qv-second">
              <Col xs={12} className="screenshot" />
            </Row>
            <Row className="qv-third">
              <Col sm={6} className="typewriter" />
              <Col sm={6} className="qv-content vertical-align">
                <div>
                  <h2>
                    <ul>
                      <li><Glyphicon glyph="ok" /> Easily manage writing groups.</li>
                      <li><Glyphicon glyph="ok" /> Share your work and manage permissions.</li>
                      <li><Glyphicon glyph="ok" /> Schedule workshops with built-in calendar.</li>
                    </ul>
                  </h2>
                </div>
              </Col>
            </Row>
            <Row className="qv-last">
              <Col xs={12} className="vertical-align qv-splash-footer">
                <div className="h4">
                  <p className="qv-tryit">What are you waiting for? <strong>Sign up for free! </strong>
                    <LinkContainer to="/signup">
                      <Button>Let&#39;s go!</Button>
                    </LinkContainer>
                  </p></div>
              </Col>
            </Row>
            <Row className="qv-last copyright">
              Copyright 2017
            </Row>
          </Grid>
        </div>
      );
    }
    return splash;
  }
}

export default connect(Splash);
