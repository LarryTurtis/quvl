import React, { PropTypes } from 'react';
import moment from 'moment';
import connect from '../util/connect';
import './Day.styl';

const Day = (props) => {
  let events;
  const day = props.day;
  const isGrey = day.gray;
  const isSelected = props.isSelected;
  const isAfter =
    moment(day).isSameOrAfter(props.today) &&
    moment(day).isSameOrAfter(props.firstDay) &&
    moment(day).isSameOrBefore(props.lastDay);
  const handleClick = () => props.callback(day);
  const bound = isAfter ? handleClick : null;

  if (props.events && props.events.length) {
    events = <p><span className="glyphicon glyphicon-star" /></p>;
  }

  return (
    <div
      onClick={bound}
      className={`${isGrey || !isAfter ? 'gray' : ''} ${isAfter ? 'after' : ''} ${isSelected ? 'selected' : ''} content day`}
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
  isSelected: PropTypes.bool,
  callback: PropTypes.func,
  events: PropTypes.array
};

export default connect(Day);
