import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';

import FileSelect from './fileSelect';
import EmailAuth from './emailAuth';


class Settings extends Component {
  render() {
    const { store } = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <FileSelect store={store} />
        </Grid>
        <Grid item xs={12}>
          <EmailAuth store={store} />
        </Grid>
      </Grid>

    );
  }
}

Settings.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line
};

export default Settings;
