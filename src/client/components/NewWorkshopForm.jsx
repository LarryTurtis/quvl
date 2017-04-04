import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { createWorkshop } from '../actions/workshop';
import Callout from './Callout';

class Workshop extends Component {

  static propTypes = {
    date: PropTypes.object,
    group: PropTypes.object,
    workshop: PropTypes.object,
    createWorkshop: PropTypes.func,
  };

  static actionsToProps = {
    createWorkshop
  };

  static stateToProps = state => ({
    workshop: state.workshop,
    group: state.group
  });

  constructor(props) {
    super(props);
    this.state = { date: props.date, selectedGroup: props.group.items[0].groupId };
  }

  componentWillReceiveProps(props) {
    this.setState({ date: props.date });
  }

  handleSlotsChange = (e) => {
    this.setState({ slots: e.target.value });
  }

  handleGroupChange = (e) => {
    this.setState({ selectedGroup: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const groupId = this.state.selectedGroup;
    const date = this.state.date;
    const slots = this.state.slots;
    this.props.createWorkshop(groupId, date, slots);
  }

  render() {
    const { workshop, group } = this.props;
    let callout;
    let groups;

    if (workshop.isSending) {
      return <div className="sb-invite-form">Spinner</div>;
    }

    if (this.state.callout) {
      callout = (<Callout
        type={this.state.callout.type}
        message={this.state.callout.message}
      />);
    }

    if (group.items) {
      groups = group.items.map(item => (
        <option value={item.groupId} key={item.groupId}>{item.name}</option>
      ));
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Schedule Workshop</h3>
        {callout}
        <label htmlFor="group">
          Select A Group:
          </label>
        <div className="form-group">
          <select
            className="form-control"
            name="group"
            required
            onChange={this.handleGroupChange}
          >
            {groups}
          </select>
        </div>
        <label htmlFor="slots">
          Number of Slots: (Leave blank for unlimited)
          </label>
        <div className="form-group">
          <input
            className="form-control"
            type="number"
            dir="auto"
            name="slots"
            onChange={this.handleSlotsChange}
          />
        </div>
        <button type="submit" className="btn btn-default">
          Save
          </button>
      </form>
    );
  }
}

export default connect(Workshop);
