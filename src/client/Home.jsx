import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import moment from 'moment';
import Moment from 'react-moment';
import connect from './util/connect';
import { listGroups } from './actions/group';
import './Home.styl';

/**
 * Transforms the groups object into an object with keys = dates.
 * @param {*} day 
 * @param {*} eventGroups 
 */
const transformEventGroups = (groups, user) => {
  const results = [];
  groups.forEach(group => {
    group.workshops.forEach(workshop => {

      const next30 = moment().add(30, 'days');

      if (moment(workshop.date).isSameOrBefore(next30) &&
        moment(workshop.date).isSameOrAfter()) {
        const userIsAdmin = group.members.some(member =>
          member.user._id === user._id
          && member.admin
        );
        const userIsMember = workshop.members.some(member => member.user._id === user._id);
        const userHasSubmitted = workshop.members.some(member => member.user._id === user._id && member.user.submitted);

        results.push({
          ...workshop,
          name: group.name,
          groupId: group.groupId,
          userIsAdmin,
          userIsMember,
          userHasSubmitted
        });
      }
    });
  });
  results.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
  return results;
};

class Home extends Component {

  static propTypes = {
    listGroups: PropTypes.func,
    group: PropTypes.object,
    login: PropTypes.object
  };

  static actionsToProps = {
    listGroups
  };

  static stateToProps = state => ({
    group: state.group,
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.listGroups();
  }

  componentWillReceiveProps(props) {
    if (props.login && props.login.user && props.group && props.group.items && props.group.items.length) {
      const transformedGroups = transformEventGroups(props.group.items, props.login.user);
      this.setState({
        transformedGroups
      });
    }
  }

  submitDoc = (groupId, workshopId) => {

  }

  removeDoc = (groupId, workshopId) => {

  }

  render() {
    let groups;
    if (this.state.transformedGroups) {
      groups = this.state.transformedGroups.map(workshop => {
        let buttons;
        const members = workshop.members.map(member => {
          const submitDoc = () => {
            this.submitDoc(workshop.groupId, workshop._id);
          };

          const removeDoc = () => {
            this.removeDoc(workshop.groupId, workshop._id);
          };

          const submitted = <p>Submitted <span className="glyphicon glyphicon-star" /></p>;
          const notSubmitted = <p>Not Submitted <span className="glyphicon glyphicon-warning-sign" /></p>;

          const submitButton = <Button bsSize="xsmall" bsStyle="primary" onClick={submitDoc}>Submit</Button>;
          const withdrawButton = <Button bsSize="xsmall" bsStyle="warning" onClick={removeDoc}>Withdraw</Button>;

          if (workshop.userIsMember) {
            buttons = (
              <ButtonToolbar>
                {workshop.userHasSubmitted ? withdrawButton : submitButton}
              </ButtonToolbar>
            );
          }

          return (<li key={member._id}><div className="media qv-member">
            <div className="media-left">
              <img alt="" className="media-object" src={member.user.picture} />
            </div>
            <div className="media-body">
              <h4 className="media-heading comment-heading">{member.user.email}</h4>
              {member.submitted ? submitted : notSubmitted}
            </div>
          </div>
          </li>);
        });

        return (
          <li className="card qv-upcoming" key={workshop._id}>
            <h4>
              <Moment format="MM/DD/YY">{workshop.date}</Moment>
              <p>Group Name: <strong>{workshop.name}</strong></p>
            </h4>
            <p>Open Slots: {workshop.slots ? workshop.slots - workshop.members.length : 'Unlimited'}</p>
            <ul>{members.length ? members : 'No one has signed up yet.'}</ul>
            {buttons}
          </li>);
      });
    }

    return (
      <div>
        Upcoming Workshops
        <ul>
          {groups}
        </ul>
      </div>
    );
  }

}

export default connect(Home);
