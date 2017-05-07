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

  removeMember(groupId, workshopId) {
    const data = { type: 'REMOVE_MEMBER' };
    this.props.updateWorkshop(groupId, workshopId, data);
  }

  cancelWorkshop(groupId, workshopId) {
    const data = { type: 'CANCEL' };
    this.props.updateWorkshop(groupId, workshopId, data);
  }

  render() {
    let eventList;
    if (this.state.events) {
      eventList = this.state.events.map(event => {
        const addMember = () => {
          this.addMember(event.groupId, event._id);
        };

        const cancel = () => {
          this.cancelWorkshop(event.groupId, event._id);
        };

        const removeMember = () => {
          this.removeMember(event.groupId, event._id);
        };

        const cancelButton = <Button bsSize="xsmall" bsStyle="danger" onClick={cancel}>Cancel</Button>;
        const signupButton = <Button bsSize="xsmall" bsStyle="primary" onClick={addMember}>Sign Up</Button>;
        const withdrawButton = <Button bsSize="xsmall" bsStyle="warning" onClick={removeMember}>Withdraw</Button>;

        const members = event.members && event.members.map(member => {
          return (
            <li className="row qv-manage-member" key={member._id}>
              <div className="col-xs-2"><img alt="" src={member.user.picture} /></div>
              <div className="col-xs-6">{member.user.email}</div>
            </li>);
        });

        return (<li key={event._id}>
          <ul className="card qv-workshop-details">
            <li><p>Group: {event.name}
              <ButtonToolbar>
                {event.userIsMember ? withdrawButton : signupButton}
                {event.userIsAdmin ? cancelButton : null}
              </ButtonToolbar>
            </p>
            </li>
            <li>
              <hr />
              <p>Remaining Slots: {event.slots ? event.slots - event.members.length : 'Unlimited'}</p>
              <p>Filled Slots:</p>
              <ul>{members}</ul>
            </li>
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
