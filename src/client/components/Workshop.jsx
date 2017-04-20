import React, { Component, PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
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
        const workshops = event.workshops.map(workshop => {
          return (
            <li className="qv-workshop card" key={workshop._id}>
              <p>Open Slots: {workshop.slots ? workshop.slots - workshop.members.length : 'Unlimited'}</p>
              <ButtonToolbar>
                <Button bsSize="xsmall" bsStyle="primary">Sign Up</Button>
                <Button bsSize="xsmall" bsStyle="danger">Delete</Button>
              </ButtonToolbar>
            </li>
          );
        });
        return (<li key={event._id}>
          <ul className="card qv-workshop-details">
            <li><h4>Group: {event.name}</h4></li>
            <ul>{workshops}</ul>
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
