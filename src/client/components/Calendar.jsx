import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import connect from '../util/connect';
import './Calendar.styl';

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

class WorkshopCalendar extends Component {

  static propTypes = {
    callback: PropTypes.func
  };

  constructor(props) {
    super(props);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.state = {
      currentMonth,
      currentYear,
      daysInMonth: getDaysInMonth(currentMonth, currentYear)
    };
  }

  getWeeks() {
    const days = this.state.daysInMonth;
    const weeks = [];
    let date;
    let currentWeek = [];
    for (let i = 0; i < days.length; i++) {
      date = days[i];
      currentWeek.push(date);
      if (date.getDay() === 6) {
        const daysToShift = 7 - currentWeek.length;
        const firstDay = currentWeek[0];
        for (let j = 0; j < daysToShift; j++) {
          const shifted = new Date(date.getTime());
          shifted.setDate(firstDay.getDate() - (j + 1));
          shifted.gray = true;
          currentWeek.unshift(shifted);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (date.getDay !== 6) {
      const daysToAdd = 7 - currentWeek.length;
      const lastDay = currentWeek[currentWeek.length - 1];
      for (let j = 0; j < daysToAdd; j++) {
        const shifted = new Date(date.getTime());
        shifted.setDate(lastDay.getDate() + j + 1);
        shifted.gray = true;
        currentWeek.push(shifted);
      }
      weeks.push(currentWeek);
    }
    return weeks;
  }

  prevMonth = () => {
    let newYear = this.state.currentYear;
    let newMonth = this.state.currentMonth - 1;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    this.setState({
      currentMonth: newMonth,
      currentYear: newYear,
      daysInMonth: getDaysInMonth(newMonth, newYear)
    });
  }

  nextMonth = () => {
    let newYear = this.state.currentYear;
    let newMonth = this.state.currentMonth + 1;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    this.setState({
      currentMonth: newMonth,
      currentYear: newYear,
      daysInMonth: getDaysInMonth(newMonth, newYear)
    });
  }

  clickedDay(day) {
    const callback = this.props.callback;
    if (callback) {
      callback(day);
    }
  }

  render() {
    let counter = 100;
    const firstDay = new Date(this.state.currentYear, this.state.currentMonth, 1);
    const lastDay = new Date(this.state.currentYear, this.state.currentMonth + 1, 0);
    const weeks = this.getWeeks().map(week => {
      const days = week.map(day => {
        const isGrey = day.gray;
        const isAfter = moment(day).isAfter() && moment(day).isSameOrAfter(firstDay) && moment(day).isSameOrBefore(lastDay);
        const bound = isAfter ? () => this.clickedDay(day) : null;
        return (
          <td key={day.getTime()}>
            <div
              onClick={bound}
              className={`${isGrey ? 'gray' : ''} ${isAfter ? 'after' : ''} content`}
            >
              {day.getDate()}
            </div>
          </td>);
      });
      counter += 1;
      return (<tr key={counter}>{days}</tr>);
    });

    return (
      <div className="qv-cal">
        <table>
          <tbody>
            <tr>
              <th colSpan="7">
                <p className="month-title">
                  <button className="btn btn-xs btn-default" onClick={this.prevMonth}>Previous</button>
                  <span className="h4">{moment.months(this.state.currentMonth)} {this.state.currentYear}</span>
                  <button className="btn btn-xs btn-default" onClick={this.nextMonth}>Next</button>
                </p>
              </th>
            </tr>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
            {weeks}
          </tbody>
        </table>
      </div>);
  }
}

export default connect(WorkshopCalendar);
