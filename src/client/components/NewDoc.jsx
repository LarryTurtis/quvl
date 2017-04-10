import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import TinyMCE from 'react-tinymce';
import connect from '../util/connect';
import { createDoc } from '../actions/doc';

class NewDoc extends Component {

  static propTypes = {
    createDoc: PropTypes.func,
    doc: PropTypes.object,
    login: PropTypes.object,
    push: PropTypes.func
  };

  static actionsToProps = {
    createDoc,
    push
  };

  static stateToProps = state => ({
    doc: state.doc,
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = () => {
    this.props.createDoc(this.state.name, this.state.content).then(result => {
      const docId = result.payload.id;
      const authorId = this.props.login.user.userId;
      this.props.push(`/doc/${authorId}/${docId}`);
    });
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  handleEditorChange = (e) => {
    this.setState({ content: e.target.getContent() });
  }

  render() {
    return (
      <div>
        <h3>
          <input
            name="docname"
            className="form-control"
            type="text"
            placeholder="Untitled"
            onChange={this.handleNameChange}
          />
        </h3>
        <TinyMCE
          config={{
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
          }}
          onChange={this.handleEditorChange}
        />
        <button className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
      </div>
    );
  }
}

export default connect(NewDoc);
