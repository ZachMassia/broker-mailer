import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardActions, CardContent, Button, TextField,
} from '@material-ui/core';

import CONSTANTS from '../constants';

class EmailAuth extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      pass: '',
    };
  }

  componentDidMount() {
    const { store } = this.props;

    // Initial check for stored path.
    const auth = store.get(CONSTANTS.EMAIL_AUTH);
    if (auth) {
      this.setState({ ...auth });
    }
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
            onClick={() => store.set(CONSTANTS.EMAIL_AUTH, this.state)}
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
