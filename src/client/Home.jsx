import React, { Component, PropTypes } from 'react';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';
import Moment from 'react-moment';
import connect from './util/connect';
import { listGroups, updateWorkshop } from './actions/group';
import { listDocs } from './actions/doc';
import './Home.styl';

/**
 * Transforms the groups object into an object with keys = dates.
 * @param {*} day 
 * @param {*} eventGroups 
 */
const transformEventGroups = (groups, user) => {
  const results = [];
  groups.forEach(group => {
    group.workshops.forEach(workshop => {
      const next30 = moment().add(30, 'days');
      const today = new Date().setHours(0, 0, 0, 0);
      if (moment(workshop.date).isSameOrBefore(next30) &&
        moment(workshop.date).isSameOrAfter(today)) {
        const userIsAdmin = group.members.some(member =>
          member.user._id === user._id
          && member.admin
        );
        const userIsMember = workshop.members.some(member => member.user._id === user._id);
        const userHasSubmitted = workshop.members.some(
          member =>
            member.user._id === user._id &&
            member.submitted
        );

        results.push({
          ...workshop,
          name: group.name,
          groupId: group.groupId,
          userIsAdmin,
          userIsMember,
          userHasSubmitted
        });
      }
    });
  });
  results.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
  return results;
};

class Home extends Component {

  static propTypes = {
    listGroups: PropTypes.func,
    listDocs: PropTypes.func,
    updateWorkshop: PropTypes.func,
    group: PropTypes.object,
    login: PropTypes.object,
    doc: PropTypes.object
  };

  static actionsToProps = {
    listGroups,
    listDocs,
    updateWorkshop
  };

  static stateToProps = state => ({
    group: state.group,
    login: state.login,
    doc: state.doc
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.listGroups();
    this.props.listDocs();
  }

  componentWillReceiveProps(props) {
    if (
      props.login &&
      props.login.user &&
      props.group &&
      props.group.items &&
      props.group.items.length
    ) {
      const transformedGroups = transformEventGroups(props.group.items, props.login.user);
      this.setState({
        transformedGroups
      });
    }
  }

  submitDoc = (e) => {
    e.preventDefault();
    const data = { type: 'SUBMIT', docId: this.state.selected.docId };
    this.props.updateWorkshop(this.state.selected.groupId, this.state.selected.workshopId, data)
      .then(() => {
        this.hideSubmitForm();
      });
  }

  withdrawDoc = (groupId, workshopId) => {
    const data = { type: 'WITHDRAW' };
    this.props.updateWorkshop(groupId, workshopId, data)
      .then(() => {
        this.hideSubmitForm();
      });
  }

  showSubmitForm = (groupId, workshopId) => {
    this.setState({
      selected: {
        groupId,
        workshopId
      }
    });
    this.setState({ visible: true });
  }

  hideSubmitForm = () => {
    this.setState({ visible: false });
  }

  handleDocSelect = (e) => {
    e.preventDefault();
    this.setState({
      selected: {
        ...this.state.selected,
        docId: e.target.value
      }
    });
  }

  render() {
    let groups;
    let docList;

    if (this.props.doc && this.props.doc.items && this.props.doc.items.length) {
      const options = this.props.doc.items.map(doc =>
        <option key={doc._id} value={doc.docId}>{doc.name}</option>
      );
      docList = (<div>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="comment">Member:</label>
            <select type="email" className="form-control" required placeholder="name@email.com" onChange={this.handleDocSelect}>
              {options}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideSubmitForm}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Modal.Footer>
      </div>);
    }
    else {
      docList = (<Modal.Body>
        You have no saved documents.
        <br />
        <Link to="/newdoc">Create one now ?</Link>
      </Modal.Body>);
    }


    const modal = (<Modal bsSize="small" show={this.state.visible} onHide={this.hideSubmitForm} aria-labelledby="contained-modal-title-sm">
      <form onSubmit={this.submitDoc}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Submit Document</Modal.Title>
        </Modal.Header>
        {docList}
      </form>
    </Modal>);

    if (this.state.transformedGroups) {
      groups = this.state.transformedGroups.map(workshop => {
        let buttons;
        const members = workshop.members.map(member => {
          const showSubmitForm = () => {
            this.showSubmitForm(workshop.groupId, workshop._id);
          };

          const withdrawDoc = () => {
            this.withdrawDoc(workshop.groupId, workshop._id);
          };

          const submitted = <p>Submitted <span className="glyphicon glyphicon-star" /></p>;
          const notSubmitted = <p>Not Submitted <span className="glyphicon glyphicon-warning-sign" /></p>;

          const submitButton = <Button bsSize="xsmall" bsStyle="primary" onClick={showSubmitForm}>Submit</Button>;
          const withdrawButton = <Button bsSize="xsmall" bsStyle="warning" onClick={withdrawDoc}>Withdraw</Button>;

          const linkToSubmission = <Link to={`/doc/${member.user.userId}/${member.doc}`}>Review Submission</Link>;

          if (workshop.userIsMember) {
            buttons = (
              <ButtonToolbar>
                {workshop.userHasSubmitted ? withdrawButton : submitButton}
              </ButtonToolbar>
            );
          }

          return (<li key={member._id}><div className="media qv-member">
            <div className="media-left">
              <img alt="" className="media-object" src={member.user.picture} />
            </div>
            <div className="media-body">
              <h4 className="media-heading comment-heading">{member.user.email}</h4>
              {member.submitted ? submitted : notSubmitted}
              {member.submitted ? linkToSubmission : ''}
            </div>
          </div>
          </li>);
        });

        return (
          <li className="card qv-upcoming" key={workshop._id}>
            <h4>
              <Moment format="MM/DD/YY">{workshop.date}</Moment>
              <p>Group Name: <strong>{workshop.name}</strong></p>
            </h4>
            <p>Open Slots: {workshop.slots ? workshop.slots - workshop.members.length : 'Unlimited'}</p>
            <ul>{members.length ? members : 'No one has signed up yet.'}</ul>
            {buttons}
          </li>);
      });
    }

    return (
      <div>
        Upcoming Workshops
        <ul>
          {groups}
        </ul>
        {modal}
      </div>
    );
  }
}

export default connect(Home);
