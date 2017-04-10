import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import connect from '../util/connect';
import './AddComment.styl';

class AddComment extends Component {

  static propTypes = {
    addCallback: PropTypes.func,
    saveCallback: PropTypes.func,
    cancelCallback: PropTypes.func,
    position: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  handleCommentSubmit = (e) => {
    e.preventDefault();
    this.props.saveCallback(this.state.comment);
  }

  showCommentForm = () => {
    this.props.addCallback();
    this.setState({ visible: true });
  }

  hideCommentForm = (e) => {
    e.preventDefault();
    this.props.cancelCallback();
    this.setState({ visible: false });
  }

  render() {
    const modal = (<Modal bsSize="small" show={this.state.visible} onHide={this.hideCommentForm} aria-labelledby="contained-modal-title-sm">
      <form onSubmit={this.handleCommentSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="comment">Comment:</label>
            <textarea id="commentBox" className="form-control" name="comment" required onChange={this.handleCommentChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.hideCommentForm}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Modal.Footer>
      </form>
    </Modal>);
    const position = this.props.position();
    const divStyle = {
      top: position.y - 40,
      left: position.x - 57
    };
    const commentForm = <Button onClick={this.showCommentForm}>Add Comment</Button>;
    return (
      <div>
        <div className="qv-add" style={divStyle} >
          {commentForm}
          <div className="highlightMenu-arrowClip">
            <span className="highlightMenu-arrow" />
          </div>
        </div>
        {modal}
      </div>
    );
  }
}

export default connect(AddComment);
