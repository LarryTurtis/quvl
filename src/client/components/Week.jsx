import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Day from './Day';
import connect from '../util/connect';

const findEventGroups = (day, eventGroups) => {
  let results = [];
  eventGroups.forEach(group => {
    const filtered = group.workshops.filter(event => moment(day).isSame(event.date, 'day'));
    if (filtered.length) {
      results = [...results, group];
    }
  });
  return results;
};

class Week extends Component {

  static propTypes = {
    week: PropTypes.array,
    currentYear: PropTypes.number,
    currentMonth: PropTypes.number,
    callback: PropTypes.func,
    events: PropTypes.array,
    selected: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDay = new Date(this.props.currentYear, this.props.currentMonth, 1);
    const lastDay = new Date(this.props.currentYear, this.props.currentMonth + 1, 0);
    const days = this.props.week.map(day => {
      const isSelected = this.props.selected === day;
      const events = this.props.events && findEventGroups(day, this.props.events);
      return (<td key={day.getTime()}>
        <Day
          callback={this.props.callback}
          day={day}
          today={today}
          firstDay={firstDay}
          lastDay={lastDay}
          events={events}
          isSelected={isSelected}
        />
      </td>);
    });
    return (<tr>{days}</tr>);
  }

}


export default connect(Week);
