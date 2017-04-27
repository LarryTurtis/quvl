import React from 'react';
import connect from '../util/connect';
import { Grid, Row, Col } from 'react-bootstrap';
import './Splash.styl';

function Splash() {
  return (
    <div>
      <div className="qv-splash">
        <h1>QUVL</h1>
      </div>
      <div className="typewriter">
      </div>
    </div>
  );
}

export default connect(Splash);
