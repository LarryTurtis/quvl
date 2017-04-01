import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';

class ManageGroup extends Component {

  static propTypes = {
    manager: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      members: this.props.manager.members,
      name: this.props.manager.name
    };
  }

  render() {
    const members = this.state.members && this.state.members.map(member => (
      <li key={member.userId}>{member.email}</li>
    ));

    return (
      <div>
        <h3>{this.state.name}</h3>
        <ul>
          {members}
        </ul>
      </div>
    );
  }
}

export default connect(ManageGroup);
