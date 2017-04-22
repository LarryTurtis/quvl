import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { listGroups } from '../actions/group';
import Calendar from './Calendar';
import Workshop from './Workshop';


/**
 * Transforms the groups object into an object with keys = dates.
 * @param {*} day 
 * @param {*} eventGroups 
 */
const transformEventGroups = (groups, user) => {
  const results = {};
  groups.forEach(group => {
    group.workshops.forEach(workshop => {
      const userIsAdmin = group.members.some(member =>
        member.user._id === user._id
        && member.admin
      );

      const userIsMember = workshop.members.some(member => member.user._id === user._id);

      const event = {
        ...workshop,
        name: group.name,
        groupId: group.groupId,
        userIsAdmin,
        userIsMember
      };

      const key = new Date(workshop.date);
      if (results[key]) {
        results[key].push(event);
      }
      else {
        results[key] = [event];
      }
    });
  });
  return results;
};

class WorkshopCalendar extends Component {

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
    if (props.group && props.group.items && props.group.items.length) {
      const transformedGroups = transformEventGroups(props.group.items, props.login.user);
      this.setState({
        transformedGroups,
        selectedEvent: transformedGroups[this.state.date]
      });
    }
  }

  handleWorkshopSelect = (date) => {
    this.setState({
      selectedEvent: this.state.transformedGroups[date],
      date,
      showWorkshop: true
    });
  }

  render() {
    let workshop;
    let groups;
    if (this.state.showWorkshop) {
      workshop = (<Workshop date={this.state.date} events={this.state.selectedEvent} />);
    }

    if (this.props.group && this.props.group.items) {
      groups = transformEventGroups(this.props.group.items, this.props.login.user);
    }

    return (
      <div className="row">
        <div className="card col-xs-6">
          <Calendar callback={this.handleWorkshopSelect} events={groups} />
        </div>
        <div className="col-xs-6">
          {workshop}
        </div>
      </div>);
  }
}

export default connect(WorkshopCalendar);
