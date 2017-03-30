import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { listDocs } from '../actions/doc';

class DocList extends Component {

  static propTypes = {
    listDocs: PropTypes.func,
    doc: PropTypes.object
  };

  static actionsToProps = {
    listDocs
  };

  static stateToProps = state => ({
    doc: state.doc
  });

  constructor(props) {
    super(props);
    this.state = {};
    this.props.listDocs();
  }

  render() {
    let docs;
    if (this.props.doc.items) {
      docs = this.props.doc.items.map(item => (
        <li value={item.docId} key={item.docId}>{item.name}</li>
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
