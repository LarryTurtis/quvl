import React from 'react';
import connect from '../util/connect';
import './Footer.styl';

function Footer() {
  return (
    <footer>
      <nav className="pt-navbar pt-dark pt-align-center">
        <div className="pt-navbar-group pt-align-center">
          <span>Copyright © 2017. All Rights Reserved.</span>
        </div>
      </nav>
    </footer>
  );
}

export default connect(Footer);
