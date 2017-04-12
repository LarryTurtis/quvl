import React, { Component, PropTypes } from 'react';
import Moment from 'react-moment';
import connect from '../util/connect';
import { commentMouseEnter, commentMouseLeave } from '../util/commentListener';

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
        (<li key={comment.commentId} onMouseEnter={commentMouseEnter} onMouseLeave={commentMouseLeave}>
          <div className="media card comment" data-id={`${comment.author.userId}-${comment.commentId}`}>
            <div className="media-left">
              <img alt="" className="media-object" src={comment.author.picture} />
            </div>
            <div className="media-body">
              <h4 className="media-heading comment-heading">{comment.author.email}<br />
                <span className="date"><Moment format="h:mma MM/DD/YY">{comment.created_at}</Moment></span>
              </h4>
            </div>
            {comment.content}
          </div>
        </li>));
    }

    return (
      <div className="comments"><ul>{comments}</ul></div>
    );
  }
}

export default connect(Comments);
