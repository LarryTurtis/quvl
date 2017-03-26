import React, { PropTypes } from 'react';
import connect from '../util/connect';
import './ValidationErrors.styl';

const ValidationErrors = ({ children }) => {
  let messages = [];
  if (children && children.length) {
    messages = children.map(
      item => <li className="sb-error-message" key={item.id}>{item.message}</li>
    );
  }
  return (
    <div>
      <span className="pt-icon-standard pt-icon-warning-sign" /> We encountered some errors:
          <ul>{messages}</ul>
    </div>
  );
};

ValidationErrors.propTypes = {
  children: PropTypes.array
};

export default connect(ValidationErrors);


