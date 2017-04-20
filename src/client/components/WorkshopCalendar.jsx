import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { listGroups } from '../actions/group';
import Calendar from './Calendar';
import Workshop from './Workshop';

class WorkshopCalendar extends Component {

  static propTypes = {
    listGroups: PropTypes.func,
    group: PropTypes.object
  };

  static actionsToProps = {
    listGroups
  };

  static stateToProps = state => ({
    group: state.group
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.listGroups();
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
    let groups;
    if (this.state.showWorkshop) {
      workshop = (<Workshop date={this.state.date} events={this.state.events} />);
    }

    if (this.props.group && this.props.group.items) {
      groups = this.props.group.items;
    }

    return (
      <div className="row">
        <div className="col-xs-6">
          <Calendar callback={this.handleWorkshopSelect} events={groups} />
        </div>
        <div className="col-xs-6">
          {workshop}
        </div>
      </div>);
  }
}

export default connect(WorkshopCalendar);
