import React, { Component, PropTypes } from 'react';

import connect from '../util/connect';
import './ManageGroup.styl';

class ShowGroup extends Component {

  static propTypes = {
    manager: PropTypes.object
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

  render() {
    const members = this.state.members && this.state.members.map(member => {
      return (
        <li className="row qv-manage-member" key={member.user.userId}>
          <div className="col-xs-2"><img alt="" src={member.user.picture} /></div>
          <div className="col-xs-6">{member.user.email}</div>
        </li>);
    });

    return (
      <div className="card qv-member-group">
        <h3>{this.state.name}</h3>
        <ul>
          {members}
        </ul>
      </div>
    );
  }
}

export default connect(ShowGroup);
