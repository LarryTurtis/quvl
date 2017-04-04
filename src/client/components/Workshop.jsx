import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import Moment from 'react-moment';
import NewWorkshopForm from './NewWorkshopForm';

class Workshop extends Component {

  static propTypes = {
    date: PropTypes.object
  };

  static actionsToProps = {
  };

  static stateToProps = state => ({
  });

  constructor(props) {
    super(props);
    this.state = { date: props.date };
  }

  componentWillReceiveProps(props) {
    this.setState({ date: props.date });
  }

  render() {
    return (
    <div>
      <Moment format="MM/DD/YYYY">{this.state.date}</Moment>
      <NewWorkshopForm date={this.state.date} />
    </div>);
  }
}

export default connect(Workshop);
