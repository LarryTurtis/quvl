import React, { PropTypes } from 'react';
import moment from 'moment';
import Day from './Day';
import connect from '../util/connect';

const findEventGroups = (day, eventGroups) => {
  let results = [];
  eventGroups.forEach(group => {
    const filtered = group.filter(event => moment(day).isSame(event.date, 'day'));
    if (filtered.length) {
      results = [...results, ...filtered];
    }
  });
  return results;
};

const Week = (props) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(props.currentYear, props.currentMonth, 1);
  const lastDay = new Date(props.currentYear, props.currentMonth + 1, 0);
  const days = props.week.map(day => {
    const events = props.events && findEventGroups(day, props.events);
    return (<td key={day.getTime()}>
      <Day
        callback={props.callback}
        day={day}
        today={today}
        firstDay={firstDay}
        lastDay={lastDay}
        events={events}
      />
    </td>);
  });
  return (<tr>{days}</tr>);
};

Week.propTypes = {
  week: PropTypes.array,
  currentYear: PropTypes.number,
  currentMonth: PropTypes.number,
  callback: PropTypes.func,
  events: PropTypes.array
};

export default connect(Week);
