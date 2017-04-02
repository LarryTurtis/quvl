import React, { Component, PropTypes } from 'react';

import connect from '../util/connect';
import './ManageGroup.styl';

class ManageGroup extends Component {

  static propTypes = {
    manager: PropTypes.object,
    callback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      members: props.manager.members,
      name: props.manager.name,
      groupId: props.manager.groupId
    };
  }

  componentWillReceiveProps(props) {
    this.state = {
      members: props.manager.members,
      name: props.manager.name,
      groupId: props.manager.groupId
    };
  }

  addMember = () => {
    const data = {
      type: 'ADD',
      groupId: this.state.groupId,
      member: { email: this.state.email }
    };
    this.props.callback(data);
  }

  removeMember = (member) => {
    const data = {
      type: 'REMOVE',
      groupId: this.state.groupId,
      member
    };
    this.props.callback(data);
  }

  render() {
    const members = this.state.members && this.state.members.map(member => {
      const bound = () => this.removeMember(member.user);
      return (
        <li className="row qv-manage-member" key={member.user.userId}>
          <div className="col-xs-2"><img alt="" src={member.user.picture} /></div>
          <div className="col-xs-6">{member.user.email}</div>
          <div className="col-xs-4"><button className="btn btn-default" onClick={bound}>Remove</button></div>
        </li>);
    });

    return (
      <div>
        <h3>{this.state.name}</h3>
        <div className="row">
          <div className="col-xs-8">
            <input type="email" onChange={this.updateEmail} />
          </div>
          <div className="col-xs-4">
            <button className="btn btn-default" onClick={this.addMember}>Add Member</button>
          </div>
        </div>
        <ul>
          {members}
        </ul>
      </div>
    );
  }
}

export default connect(ManageGroup);
