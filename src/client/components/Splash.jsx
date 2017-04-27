import React from 'react';
import { Nav, NavItem, Grid, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import connect from '../util/connect';
import './Splash.styl';

function Splash() {
  return (
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
          <Col xs={6} className="vertical-align qv-jumbo">
            <div>
              <h1>Quvl makes writing fun.</h1>
              <p>
                Quvl enables you to give and receive feedback on your work in a clean, flexible, and rewarding way.
              </p>
              <p><LinkContainer to="/signup"><span className="qv-tryit">Let's go!</span></LinkContainer></p>
            </div>
          </Col>
          <Col xs={6} className="book" />
        </Row>
        <Row>
          <Col xs={12} className="writing" />
        </Row>
        <Row>
          <Col xs={12} className="typewriter" />
        </Row>
      </Grid>
    </div>
  );
}

export default connect(Splash);
