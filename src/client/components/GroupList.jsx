import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { listGroups, updateMember } from '../actions/group';
import ManageGroup from './ManageGroup';
import ShowGroup from './ShowGroup';

class GroupList extends Component {

  static propTypes = {
    listGroups: PropTypes.func,
    updateMember: PropTypes.func,
    group: PropTypes.object,
    login: PropTypes.object
  };

  static actionsToProps = {
    listGroups,
    updateMember
  };

  static stateToProps = state => ({
    group: state.group,
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.listGroups();
  }

  updateGroup = ({ type, groupId, member }) => {
    this.props.updateMember(groupId, { type, member });
  }

  render() {
    const groups = this.props.group;
    let memberGroups;
    if (groups.isSending) {
      return (<div></div>);
    }
    if (groups && groups.items) {
      memberGroups = groups.items.map(group => {
        const userIsAdmin = group.members.some(member =>
          member.user._id === this.props.login.user._id
          && member.admin
        );
        if (userIsAdmin) {
          return <ManageGroup key={group.groupId} manager={group} callback={this.updateGroup} />;
        }
        return <ShowGroup key={group.groupId} manager={group} />;
      }
      );
    }
    return (
      <div className="row">
        <div className="col-xs-10">
          <h4>You are a member of these groups</h4>
          {memberGroups}
        </div>
      </div>
    );
  }
}

export default connect(GroupList);
