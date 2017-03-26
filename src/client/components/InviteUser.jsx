import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { fetchChannels } from '../actions/channels';
import { sendInvite } from '../actions/invite';
import Spinner from '../components/Spinner';
import Callout from '../components/Callout';
import './InviteUser.styl';

const FAIL = 'Failed to send.';
const SUCCESS = 'Invite sent.';

class InviteUser extends Component {

  static propTypes = {
    fetchChannels: PropTypes.func,
    sendInvite: PropTypes.func,
    channels: PropTypes.object,
    invite: PropTypes.object
  };

  static actionsToProps = {
    fetchChannels,
    sendInvite
  };

  static stateToProps = state => ({
    channels: state.channels,
    invite: state.invite
  });

  constructor(props) {
    super(props);
    this.props.fetchChannels();
    this.state = {};
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  }

  handleChannelChange = (e) => {
    this.setState({ selectedChannel: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ callout: false });
    this.props.sendInvite(this.state.email, this.state.selectedChannel)
      .then(sent => {
        const type = sent.error ? Callout.failure : Callout.success;
        const message = sent.error ? FAIL : SUCCESS;
        this.setState({ callout: { type, message } });
      });
  }

  render() {
    const { channels, invite } = this.props;
    let options = [];
    let callout;

    if (channels.isFetching || invite.isSending) {
      return <div className="sb-invite-form"><Spinner /></div>;
    }

    if (channels.items) {
      const empty = [<option key="0" value="">None</option>];
      options = options.concat(empty, channels.items.map(item => (
        <option value={item.Id} key={item.Id}>{item.Title}</option>
      )));
    }

    if (this.state.callout) {
      callout = (<Callout
        type={this.state.callout.type}
        message={this.state.callout.message}
      />);
    }

    return (
      <form className="sb-invite-form" onSubmit={this.handleSubmit}>
        <h3>Invite A User</h3>
        <div className="pt-form-group">
          {callout}
          <label htmlFor="email" className="pt-label modifier">
            Email Address:
            <div className="pt-input-group modifier">
              <span className="pt-icon pt-icon-envelope" />
              <input
                className="pt-input"
                type="email"
                required
                placeholder="name@address.com"
                dir="auto"
                name="email"
                onChange={this.handleEmailChange}
              />
            </div>
          </label>
          <label htmlFor="channel" className="pt-label modifier">
            Channel Name:
            <div className="pt-select modifier">
              <select
                name="channel"
                required
                onChange={this.handleChannelChange}
              >
                {options}
              </select>
            </div>
          </label>
          <button type="submit" className="pt-button pt-intent-success">
            Send
          <span className="pt-icon-standard pt-icon-arrow-right pt-align-right" />
          </button>
        </div>
      </form>
    );
  }
}

export default connect(InviteUser);
