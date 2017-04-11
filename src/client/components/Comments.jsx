import React, { Component, PropTypes } from 'react';
import Moment from 'react-moment';
import connect from '../util/connect';

class Comments extends Component {

  static propTypes = {
    children: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let comments = [];
    if (this.props.children) {
      comments = this.props.children.map(comment =>
        (<li key={comment.commentId}>
          <div data-id={`${comment.author.userId}-${comment.commentId}`} className="card comment">
            <div className="comment-heading">
              <img alt="" src={comment.author.picture} /> {comment.author.email}<br />
              <span className="date"><Moment format="h:mm A MM-DD-YY">{comment.created_at}</Moment></span>
            </div>
            <div className="comment-content">
              {comment.content}
            </div>
          </div>
        </li>));
    }

    return (
      <div className="comments"><ul>{comments}</ul></div>
    );
  }
}

export default connect(Comments);
