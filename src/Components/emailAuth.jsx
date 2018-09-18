import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Card, CardActions, CardContent, Button, TextField,
} from '@material-ui/core';

import CONSTANTS from '../constants';

class EmailAuth extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      pass: '',
    };

    // Register to the filePath updates inside the store.
    // Any changes made to store from the renderer side will be caught by this.
    ipcRenderer.on(CONSTANTS.EV_EMAIL_AUTH_UPDATED, (_, arg) => {
      this.setState({ ...arg });
    });
  }

  componentDidMount() {
    const { store } = this.props;

    // Initial check for stored path.
    const auth = store.get(CONSTANTS.EMAIL_AUTH);
    if (auth) {
      this.setState({ ...auth });
    }

    // Register to the filePath updates.
    store.onDidChange(CONSTANTS.EMAIL_AUTH, auth => this.setState({ ...auth }));
  }

  handleUserChange = (e) => {
    this.setState({ user: e.target.value });
  }

  handlePassChange = (e) => {
    this.setState({ pass: e.target.value });
  }

  render() {
    const { user, pass } = this.state;
    const { store } = this.props;

    return (
      <Card>
        <CardContent>
        <TextField
          id="email-username"
          label="Username"
          value={user}
          onChange={this.handleUserChange}
        />
        <br />
        <TextField
         id="email-password"
         type="password"
         label="Password"
         value={pass}
         onChange={this.handlePassChange}
        />
          
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => store.set(CONSTANTS.EMAIL_AUTH, { ...user, ...pass })}
          >
            Update credentials
          </Button>
        </CardActions>
      </Card>
    );
  }
}

EmailAuth.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default EmailAuth;
