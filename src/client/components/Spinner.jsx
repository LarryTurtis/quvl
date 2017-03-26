import React from 'react';
import connect from '../util/connect';
import './Spinner.styl';

function Spinner() {
  return (
    <div className="sb-spinner">
      <div className="pt-spinner .modifier">
        <div className="pt-spinner-svg-container">
          <svg viewBox="0 0 100 100">
            <path className="pt-spinner-track" d="M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89" />
            <path className="pt-spinner-head" d="M 94.5 50 A 44.5 44.5 0 0 0 50 5.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default connect(Spinner);
