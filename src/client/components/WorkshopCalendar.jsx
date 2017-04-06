import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import connect from '../util/connect';
import { listGroups } from '../actions/group';
import { listWorkshops } from '../actions/workshop';
import Calendar from './Calendar';
import Workshop from './Workshop';

function getMonthDates(date) {
  const current = date || new Date();
  return {
    start: new Date(current.getFullYear(), current.getMonth(), 1),
    end: new Date(current.getFullYear(), current.getMonth() + 1, 0)
  };
}

class WorkshopCalendar extends Component {

  static propTypes = {
    listWorkshops: PropTypes.func,
    listGroups: PropTypes.func,
    group: PropTypes.object,
    workshop: PropTypes.object
  };

  static actionsToProps = {
    listWorkshops,
    listGroups
  };

  static stateToProps = state => ({
    workshop: state.workshop,
    group: state.group
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.listGroups()
      .then(() => {
        const groupIds = this.props.group &&
          this.props.group.items &&
          this.props.group.items.map(group => group.groupId);
        if (groupIds) {
          this.props.listWorkshops({ ...getMonthDates(), groupIds });
        }
      });
  }

  handleWorkshopSelect = (date, events) => {
    this.setState({
      events,
      date,
      showWorkshop: true
    });
  }

  render() {
    let workshop;
    if (this.state.showWorkshop) {
      workshop = (<Workshop date={this.state.date} events={this.state.events} />);
    }

    return (
      <div className="row">
        <div className="col-xs-6">
          <Calendar callback={this.handleWorkshopSelect} events={this.props.workshop.items} />
        </div>
        <div className="col-xs-6">
          {workshop}
        </div>
      </div>);
  }
}

export default connect(WorkshopCalendar);
