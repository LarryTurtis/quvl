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
    this.setState({
      members: props.manager.members,
      name: props.manager.name,
      groupId: props.manager.groupId
    });
  }

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  addMember = (e) => {
    e.preventDefault();
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

  promote = (member) => {
    const data = {
      type: 'PROMOTE',
      groupId: this.state.groupId,
      member
    };
    this.props.callback(data);
  }

  demote = (member) => {
    const data = {
      type: 'DEMOTE',
      groupId: this.state.groupId,
      member
    };
    this.props.callback(data);
  }

  render() {
    const members = this.state.members && this.state.members.map(member => {
      const boundRemove = () => this.removeMember(member.user);
      const boundPromote = () => this.promote(member.user);
      const boundDemote = () => this.demote(member.user);
      let promoteButton = <button className="btn btn-default" onClick={boundPromote}>Make Admin</button>;
      if (member.admin) {
        promoteButton = <button className="btn btn-default" onClick={boundDemote}>Remove Admin</button>
      }
      return (
        <li className="row qv-manage-member" key={member.user.userId}>
          <div className="col-xs-2"><img alt="" src={member.user.picture} /></div>
          <div className="col-xs-4">{member.user.email}</div>
          <div className="col-xs-6">
            <button className="btn btn-default" onClick={boundRemove}>Remove</button>
            {promoteButton}
          </div>
        </li>);
    });

    return (
      <div className="card form-inline qv-group">
        <h3>{this.state.name}</h3>
        <form onSubmit={this.addMember}>
          <div className="row">
            <div className="col-xs-6">
              <input type="email" onChange={this.updateEmail} />
            </div>
            <div className="col-xs-6">
              <button className="btn btn-default">Add Member</button>
            </div>
          </div>
        </form>
        <ul>
          {members}
        </ul>
      </div>
    );
  }
}

export default connect(ManageGroup);
