import React, { Component, PropTypes } from 'react';
import Moment from 'react-moment';
import connect from '../util/connect';
import { highlightSelected, clearHighlighted } from '../util/commentListener';
import './Comments.styl';

class Comments extends Component {

  static propTypes = {
    children: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (selected) => {
    clearHighlighted();
    highlightSelected([selected]);
    this.setState({ selected });
  }

  render() {
    let comments = [];
    if (this.props.children) {
      comments = this.props.children.map(comment => {
        const dataId = `${comment.author.userId}-${comment.commentId}`;
        const handleClick = () => {
          this.handleClick(dataId);
        };
        const classes = `media card comment ${this.state.selected === dataId ? 'highlight' : ''}`;
        return (<li
          key={comment.commentId}
          onClick={handleClick}
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
