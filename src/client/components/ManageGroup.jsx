import React, { Component, PropTypes } from 'react';
import { Modal, Button, ButtonToolbar, Alert } from 'react-bootstrap';

import connect from '../util/connect';
import './ManageGroup.styl';

class ManageGroup extends Component {

  static propTypes = {
    manager: PropTypes.object,
    callback: PropTypes.func,
    login: PropTypes.object
  };

  static stateToProps = state => ({
    login: state.login
  });

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

  showAddMemberForm = () => {
    this.setState({ visible: true });
  }

  hideAddMemberForm = (e) => {
    e.preventDefault();
    this.setState({ visible: false });
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

    const demoMode = this.props.login && this.props.login.user && this.props.login.user.demoUser;

    const members = this.state.members && this.state.members.map(member => {
      const boundRemove = () => this.removeMember(member.user);
      const boundPromote = () => this.promote(member.user);
      const boundDemote = () => this.demote(member.user);
      let promoteButton = <Button onClick={boundPromote} disabled={demoMode}>Make Admin</Button>;
      if (member.admin) {
        promoteButton = <Button onClick={boundDemote} disabled={demoMode}>Remove Admin</Button>
      }
      return (
        <li className="row qv-manage-member" key={member.user.userId}>
          <div className="col-xs-2"><img alt="" src={member.user.picture} /></div>
          <div className="col-xs-4">{member.user.email}</div>
          <div className="col-xs-6">
            <ButtonToolbar>
              <Button disabled={demoMode} onClick={boundRemove}>Remove</Button>
              {promoteButton}
            </ButtonToolbar>
          </div>
        </li>);
    });

    const modal = (<Modal bsSize="small" show={this.state.visible} onHide={this.hideAddMemberForm} aria-labelledby="contained-modal-title-sm">
      <form onSubmit={this.addMember}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Add Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="comment">Member:</label>
            <input type="email" className="form-control" required placeholder="name@email.com" onChange={this.updateEmail} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideAddMemberForm}>Cancel</Button>
          <Button type="submit" disabled={demoMode}>Save</Button>
        </Modal.Footer>
      </form>
    </Modal>);

    return (
      <div className="card form-inline qv-group">
        <div className="qv-group-header">
          {this.state.name}
          <Button onClick={this.showAddMemberForm} disabled={demoMode}>Add Member</Button>
        </div>
        <ul>
          {members}
        </ul>
        {modal}
      </div>
    );
  }
}

export default connect(ManageGroup);
