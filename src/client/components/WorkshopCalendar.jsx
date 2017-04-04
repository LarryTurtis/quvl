import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import connect from '../util/connect';
import { listWorkshops } from '../actions/workshop';
import Calendar from './Calendar';
import Workshop from './Workshop';

class WorkshopCalendar extends Component {

  static propTypes = {
    listWorkshops: PropTypes.func
  };

  static actionsToProps = {
    listWorkshops
  };

  static stateToProps = state => ({
    workshop: state.workshop
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  handleWorkshopSelect = (date) => {
    this.setState({
      selectedDate: date,
      showWorkshop: true
    });
  }

  render() {
    let workshop;
    if (this.state.showWorkshop) {
      workshop = (<Workshop date={this.state.selectedDate} />);
    }

    return (
      <div className="row">
        <div className="col-xs-6">
          <Calendar callback={this.handleWorkshopSelect} />
        </div>
        <div className="col-xs-6">
          {workshop}
        </div>
      </div>);
  }
}

export default connect(WorkshopCalendar);
