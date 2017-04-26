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

  hoveredComment = (selected) => {
    this.setState({ selected });
    commentMouseEnter(selected);
  }

  unhoveredComment = (selected) => {
    if (this.state.selected === selected) {
      this.setState({ selected: null });
      commentMouseLeave(selected);
    }
  }

  render() {
    let comments = [];
    if (this.props.children) {
      comments = this.props.children.map(comment => {
        const dataId = `${comment.author.userId}-${comment.commentId}`;
        const hover = () => {
          this.hoveredComment(dataId);
        };
        const unhover = () => {
          this.unhoveredComment(dataId);
        };
        const classes = `media card comment ${this.state.selected === dataId ? 'highlight' : ''}`;
        return (<li
          key={comment.commentId}
          onMouseEnter={hover}
          onMouseLeave={unhover}
        >
          <div className={classes} data-id={dataId}>
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
        </li>
        );
      });
    }

    return (
      <div className="comments"><ul>{comments}</ul></div>
    );
  }
}

export default connect(Comments);
