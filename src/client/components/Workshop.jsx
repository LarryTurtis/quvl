import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import Moment from 'react-moment';
import NewWorkshopForm from './NewWorkshopForm';
import './Workshop.styl';

class Workshop extends Component {

  static propTypes = {
    date: PropTypes.object,
    events: PropTypes.array
  };

  static actionsToProps = {
  };

  static stateToProps = state => ({
  });

  constructor(props) {
    super(props);
    this.state = { date: props.date, events: props.events };
  }

  componentWillReceiveProps(props) {
    this.setState({ date: props.date, events: props.events });
  }

  render() {
    let eventList;
    if (this.state.events) {
      eventList = this.state.events.map(event => {
        return (<li key={event._id}>
          <ul className="qv-workshop-details">
            <li><h4>Workshop</h4></li>
            <li>Group: {event.group.name}</li>
            <li>Open Slots: {event.slots - event.members.length}</li>
          </ul>
        </li>);
      });
    }

    return (
      <div>
        <Moment format="MM/DD/YYYY">{this.state.date}</Moment>
        <ul>
          {eventList}
        </ul>
        <NewWorkshopForm date={this.state.date} />
      </div>);
  }
}

export default connect(Workshop);
