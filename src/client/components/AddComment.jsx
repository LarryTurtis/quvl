import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';

class AddComment extends Component {

  static propTypes = {
    addCallback: PropTypes.func,
    saveCallback: PropTypes.func,
    cancelCallback: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  handleCommentSubmit = () => {
    this.props.saveCallback(this.state.comment);
  }

  showCommentForm = () => {
    this.props.addCallback();
    this.setState({ visible: true });
  }

  hideCommentForm = () => {
    this.props.cancelCallback();
    this.setState({ visible: false });
  }

  render() {
    let commentForm;
    if (this.state.visible) {
      commentForm = (
        <div className="addComment">
          <form>
            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea id="commentBox" className="form-control" name="comment" onChange={this.handleCommentChange} />
            </div>
          </form>
          <button id="saveCommentButton" className="btn btn-primary" onClick={this.handleCommentSubmit}>Add</button>
          <button id="cancelCommentButton" className="btn btn-cancel" onClick={this.hideCommentForm}>Cancel</button>
        </div>);
    }
    return (
      <div>
        <button id="addCommentButton" className="btn btn-primary" onClick={this.showCommentForm}>Add Comment</button>
        {commentForm}
      </div>
    );
  }
}

export default connect(AddComment);
