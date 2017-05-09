import React, { Component, PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import connect from '../util/connect';
import { highlightSelected, clearHighlighted } from '../util/commentListener';
import './Comments.styl';

class Comments extends Component {

  static propTypes = {
    children: PropTypes.array,
    deleteCallback: PropTypes.func,
    login: PropTypes.object
  }

  static stateToProps = state => ({
    login: state.login
  });

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
        let buttons;
        const dataId = `${comment.author.userId}-${comment.commentId}`;
        const handleClick = () => {
          this.handleClick(dataId);
        };
        const classes = `media card comment ${this.state.selected === dataId ? 'highlight' : ''}`;
        const boundDelete = () => { this.props.deleteCallback(comment.commentId) };

        const userId = this.props.login.user && this.props.login.user.userId;

        if (userId && comment.author.userId === userId) {
          buttons = (
            <Button bsSize="xsmall" bsStyle="danger" className="pull-right" onClick={boundDelete}>Delete</Button>
          );
        }

        return (<li
          key={comment.commentId}
          onClick={handleClick}
        >
          <div className={classes} data-id={dataId}>
            <div className="qv-triangle" />
            <div className="qv-triangle inner" />
            <ButtonToolbar className="qv-delete">
              {buttons}
            </ButtonToolbar>
            <div className="media-body-container">
              <div className="media-left">
                <img alt="" className="media-object" src={comment.author.picture} />
              </div>
              <div className="media-body">
                <p className="media-heading comment-heading">{comment.author.email}
                  <br />
                  <span className="date"><Moment format="h:mma MM/DD/YY">{comment.created_at}</Moment></span>
                </p>
              </div>
              {comment.content}
            </div>
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
