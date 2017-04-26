import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { getDoc } from '../actions/doc';
import { saveComment } from '../actions/comment';
import Comments from './Comments';
import AddComment from './AddComment';
import Selector from '../util/selector';
import { highlightSelected, clearHighlighted } from '../util/commentListener';
import './Doc.styl';

function findParents(node) {
  const results = [];
  while (node != null) {
    const attribute = node.getAttribute && node.getAttribute('data-id');
    if (attribute) {
      results.push(node);
    }
    node = node.parentNode;
  }
  return results;
}

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
    this.selector.cancel();
    this.selector.on();
  }

  handleClick = (e) => {
    clearHighlighted();
    const els = findParents(e.target);
    let arr = [];
    els.forEach(el => {
      const id = el.getAttribute('data-id');
      if (id) {
        arr = [...arr, id.split(' ')];
      }
    });
    highlightSelected(arr);
  };

  render() {
    const failure = (
      <div className="row">
        <h1>Error: Document does not exist</h1>
      </div>
    );

    if (this.props.doc.error) {
      return failure;
    }

    const doc = this.props.doc.current;
    let addCommentButton;
    let comments;

    if (doc && doc.comments && doc.comments.length) {
      comments = <Comments>{doc && doc.comments}</Comments>;
    }

    if (this.state.selectedText) {
      addCommentButton = (<AddComment
        position={this.selector.position}
        addCallback={this.addComment}
        saveCallback={this.saveComment}
        cancelCallback={this.cancelComment}
      />);
    }

    const success = (
      <div className="row" onClick={this.handleClick}>
        <h1>{doc && doc.name}</h1>
        <div id="content"
          className="card col-sm-9"
          dangerouslySetInnerHTML={this.getMarkup(doc && doc.revisions[doc.revisions.length - 1].doc)}
        />
        <div id="comments" className="col-sm-3">
          {comments}
        </div>
        {addCommentButton}
      </div>
    );

    return success;
  }
}

export default connect(Doc);
