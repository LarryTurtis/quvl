import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router';
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
    const demoMode = this.props.login && this.props.login.user && this.props.login.user.demoUser;
    let callout;

    if (demoMode) {
      callout = (<Alert bsStyle="warning">
        <h4>Demo Mode</h4>
        <p>This feature is disabled in demo mode.</p>
      </Alert>);
    }

    let memberGroups;
    let groupHeader = (
      <div>
        You are not currently a member of any groups. Want to <Link to='/newgroup'>create a group?</Link>
      </div>
    );
    if (groups.isSending) {
      return (<div></div>);
    }
    if (groups && groups.items && groups.items.length) {
      groupHeader = 'You are a member of these groups:';
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
          {callout}
          <h4>{groupHeader}</h4>
          {memberGroups}
        </div>
      </div>
    );
  }
}

export default connect(GroupList);
