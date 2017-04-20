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
    let workshops;
    if (this.state.showWorkshop) {
      workshop = (<Workshop date={this.state.date} events={this.state.events} />);
    }

    if (this.props.group && this.props.group.items) {
      workshops = this.props.group.items.map(item => {
        return item.workshops;
      });
    }

    return (
      <div className="row">
        <div className="col-xs-6">
          <Calendar callback={this.handleWorkshopSelect} events={workshops} />
        </div>
        <div className="col-xs-6">
          {workshop}
        </div>
      </div>);
  }
}

export default connect(WorkshopCalendar);
