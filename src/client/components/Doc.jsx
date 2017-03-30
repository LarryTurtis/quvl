import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { getDoc } from '../actions/doc';
import { saveComment } from '../actions/comment';
import Comments from './Comments';
import AddComment from './AddComment';
import Selector from '../util/selector';

class Doc extends Component {

  static propTypes = {
    getDoc: PropTypes.func,
    saveComment: PropTypes.func,
    doc: PropTypes.object,
    params: PropTypes.object
  };

  static actionsToProps = {
    getDoc,
    saveComment
  };

  static stateToProps = state => ({
    doc: state.doc
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.loadDoc();
  }


  componentDidMount = () => {
    this.selector = new Selector(document.getElementById('content'), this.handleSelect, this.handleDeselect);
  }

  getMarkup(doc) {
    return { __html: doc };
  }

  loadDoc = () => {
    const docId = this.props.params.docId;
    const authorId = this.props.params.authorId;
    this.props.getDoc(authorId, docId);
    this.setState({ selectedText: false, nodes: [] });
  }

  handleSelect = (nodes) => {
    this.setState({ selectedText: true, nodes });
  }

  handleDeselect = () => {
    this.setState({ selectedText: false, nodes: [] });
  }

  addComment = () => {
    this.selector.off();
  }

  saveComment = (comment) => {
    const docId = this.props.params.docId;
    const authorId = this.props.params.authorId;
    this.props.saveComment(authorId, docId, this.state.nodes, comment)
      .then(() => {
        this.loadDoc();
        this.selector.on();
      });
  }

  cancelComment = () => {
    this.setState({ selectedText: false, nodes: [] });
    this.selector.on();
  }

  render() {
    const doc = this.props.doc.current;
    let addCommentButton;

    if (this.state.selectedText) {
      addCommentButton = (<AddComment
        addCallback={this.addComment}
        saveCallback={this.saveComment}
        cancelCallback={this.cancelComment}
      />);
    }

    return (
      <div className="row">
        <h1>{doc && doc.name}</h1>
        <div id="content" className="col-sm-8" dangerouslySetInnerHTML={this.getMarkup(doc && doc.revisions[doc.revisions.length - 1].doc)} />
        <div className="col-sm-4 comments">
          {addCommentButton}
          <Comments>{doc && doc.comments}</Comments>
        </div>
      </div>
    );
  }
}

export default connect(Doc);
