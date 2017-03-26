import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import './Callout.styl';

class Callout extends Component {

  static propTypes = {
    type: PropTypes.string,
    message: PropTypes.string,
    content: PropTypes.string
  }

  static success = 'pt-intent-success';
  static failure = 'pt-intent-danger';

  constructor(props) {
    super(props);
    this.state = {
      type: props.type || '',
      message: props.message || '',
      content: props.content || ''
    };
  }

  render() {
    return (
      <div className="sb-callout" >
        <div className={`pt-callout ${this.state.type}`}>
          <h5>{this.state.message}</h5>
          {this.state.content}
        </div>
      </div>
    );
  }
}

export default connect(Callout);
