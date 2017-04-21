import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { createWorkshop } from '../actions/group';
import Callout from './Callout';

const filterGroups = ({ items }, { user }) => items.filter(item =>
  item.members.some(member =>
    member.user._id === user._id
    && member.admin));

class Workshop extends Component {

  static propTypes = {
    date: PropTypes.object,
    group: PropTypes.object,
    login: PropTypes.object,
    createWorkshop: PropTypes.func
  };

  static actionsToProps = {
    createWorkshop
  };

  static stateToProps = state => ({
    group: state.group,
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      showForm: false
    };
    const filteredGroups = filterGroups(props.group, props.login);
    if (filteredGroups && filteredGroups.length) {
      this.state.filteredGroups = filteredGroups;
      this.state.selectedGroup = filteredGroups[0].groupId;
    }
  }

  componentWillReceiveProps(props) {
    this.state = {
      date: props.date,
      showForm: false
    };
    const filteredGroups = filterGroups(props.group, props.login);
    if (filteredGroups && filteredGroups.length) {
      this.state.filteredGroups = filteredGroups;
      this.state.selectedGroup = filteredGroups[0].groupId;
    }
  }

  handleSlotsChange = (e) => {
    this.setState({ slots: e.target.value });
  }

  handleGroupChange = (e) => {
    this.setState({ selectedGroup: e.target.value });
  }

  showForm = () => {
    this.setState({ showForm: true });
  }

  hideForm = () => {
    this.setState({ showForm: false });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const groupId = this.state.selectedGroup;
    const date = this.state.date;
    const slots = this.state.slots;
    this.props.createWorkshop(groupId, date, slots);
  }

  render() {
    const { group } = this.props;
    let callout;
    let groups;

    if (group.isSending) {
      return <div className="sb-invite-form">Spinner</div>;
    }

    if (this.state.callout) {
      callout = (<Callout
        type={this.state.callout.type}
        message={this.state.callout.message}
      />);
    }

    // transform groups into html
    if (this.state.filteredGroups) {
      groups = this.state.filteredGroups.map(item =>
        <option value={item.groupId} key={item.groupId} > {item.name}</option>);
    }

    const button = (<button onClick={this.showForm} className="btn btn-default">Schedule Workshop</button>);
    const form = (<form onSubmit={this.handleSubmit}>
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
      <button type="submit" className="btn btn-default">Save</button>
      <button onClick={this.hideForm} className="btn btn-default">Cancel</button>
    </form>);

    if (groups) {
      if (this.state.showForm) {
        return form;
      }
      return button;
    }
    return (<div />);
  }
}

export default connect(Workshop);
