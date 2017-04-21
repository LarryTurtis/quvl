import React, { Component, PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import connect from '../util/connect';
import NewWorkshopForm from './NewWorkshopForm';
import { updateWorkshop } from '../actions/group';
import './Workshop.styl';

class Workshop extends Component {

  static propTypes = {
    date: PropTypes.object,
    events: PropTypes.array,
    updateWorkshop: PropTypes.func
  };

  static actionsToProps = {
    updateWorkshop
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

  addMember(groupId, workshopId) {
    const data = { type: 'ADD_MEMBER' };
    this.props.updateWorkshop(groupId, workshopId, data);
  }

  render() {
    let eventList;
    if (this.state.events) {
      eventList = this.state.events.map(event => {
        const workshops = event.workshops.map(workshop => {
          const addMember = () => {
            this.addMember(event.groupId, workshop._id);
          };
          return (
            <li className="qv-workshop card" key={workshop._id}>
              <p>Open Slots: {workshop.slots ? workshop.slots - workshop.members.length : 'Unlimited'}</p>
              <ButtonToolbar>
                <Button bsSize="xsmall" bsStyle="primary" onClick={addMember}>Sign Up</Button>
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
        <div>
          <Moment format="MM/DD/YYYY">{this.state.date}</Moment>
        </div>
        <NewWorkshopForm date={this.state.date} />
        <ul>
          {eventList}
        </ul>
      </div>);
  }
}

export default connect(Workshop);
