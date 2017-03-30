import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import connect from '../util/connect';
import { listDocs } from '../actions/doc';

class DocList extends Component {

  static propTypes = {
    listDocs: PropTypes.func,
    doc: PropTypes.object,
    user: PropTypes.object
  };

  static actionsToProps = {
    listDocs
  };

  static stateToProps = state => ({
    doc: state.doc,
    user: state.login.user
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.listDocs();
  }

  render() {
    let docs;
    if (this.props.doc.items) {
      docs = this.props.doc.items.map(item => (
        <li value={item.docId} key={item.docId}><Link to={`/doc/${this.props.user.userId}/${item.docId}`}>{item.name}</Link></li>
      ));
    }
    return (
      <ul>
        {docs}
      </ul>
    );
  }
}

export default connect(DocList);
