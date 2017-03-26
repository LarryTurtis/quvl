import React from 'react';
import connect from '../util/connect';

function Sidebar() {
  return (
    <ul id="sb-sidebar" className="pt-menu pt-elevation-1">
      <li className="pt-menu-header"><h6>Items</h6></li>
      <li><button type="button" className="pt-menu-item pt-icon-layout-auto">Auto</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-layout-circle">Circle</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-layout-grid">Grid</button></li>
      <li className="pt-menu-header"><h6>Views</h6></li>
      <li><button type="button" className="pt-menu-item pt-icon-history">History</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-star">Favorites</button></li>
      <li><button type="button" className="pt-menu-item pt-icon-envelope">Messages</button></li>
    </ul>
  );
}

export default connect(Sidebar);
