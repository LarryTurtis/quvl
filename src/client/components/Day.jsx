import React, { PropTypes } from 'react';
import moment from 'moment';
import connect from '../util/connect';

const Day = (props) => {
  let events;
  const day = props.day;
  const isGrey = day.gray;
  const isAfter =
    moment(day).isSameOrAfter(props.today) &&
    moment(day).isSameOrAfter(props.firstDay) &&
    moment(day).isSameOrBefore(props.lastDay);
  const bound = isAfter ? () => props.callback(day, props.events) : null;

  if (props.events.length) {
    events = <p><span className="glyphicon glyphicon-book" /></p>;
  }

  return (
    <div
      onClick={bound}
      className={`${isGrey ? 'gray' : ''} ${isAfter ? 'after' : ''} content`}
    >
      {day.getDate()}
      {events}
    </div>
  );
};

Day.propTypes = {
  day: PropTypes.object,
  today: PropTypes.object,
  firstDay: PropTypes.object,
  lastDay: PropTypes.object,
  callback: PropTypes.func,
  events: PropTypes.array
};

export default connect(Day);
