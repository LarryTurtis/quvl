import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { listGroups } from '../actions/group';
import ManageGroup from './ManageGroup';

class GroupList extends Component {

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

  render() {
    const groups = this.props.group;
    let adminGroups;
    let memberGroups;
    if (groups && groups.items && groups.items.members) {
      memberGroups = groups.items.members.map(group =>
        <ManageGroup key={group.groupId} manager={group} />
      );
    }
    if (groups && groups.items && groups.items.admins) {
      adminGroups = groups.items.admins.map(group =>
        <ManageGroup key={group.groupId} manager={group} />
      );
    }
    return (
      <div className="row">
        <div className="col-xs-6">
          {memberGroups}
        </div>
        <div className="col-xs-6">
          {adminGroups}
        </div>
      </div>
    );
  }
}

export default connect(GroupList);
