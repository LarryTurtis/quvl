import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { listGroups, addMember, removeMember } from '../actions/group';
import ManageGroup from './ManageGroup';
import NewGroup from './NewGroup';

class GroupList extends Component {

  static propTypes = {
    listGroups: PropTypes.func,
    addMember: PropTypes.func,
    removeMember: PropTypes.func,
    group: PropTypes.object
  };

  static actionsToProps = {
    listGroups,
    addMember,
    removeMember
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

  updateGroup = ({ type, groupId, member }) => {
    if (type === 'ADD') {
      this.props.addMember(groupId, member);
    }
    if (type === 'REMOVE') {
      this.props.removeMember(groupId, member);
    }
  }

  render() {
    const groups = this.props.group;
    let memberGroups;
    if (groups && groups.items) {
      memberGroups = groups.items.map(group =>
        <ManageGroup key={group.groupId} manager={group} callback={this.updateGroup} />
      );
    }
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <h4>You are a member of these groups</h4>
            {memberGroups}
          </div>
        </div>
        <div className="row">
          <NewGroup />
        </div>
      </div>
    );
  }
}

export default connect(GroupList);
