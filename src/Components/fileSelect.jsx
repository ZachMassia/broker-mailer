import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Card, CardActions, CardContent, Button,
} from '@material-ui/core';

import CONSTANTS from '../constants';

class FileSelect extends Component {
  render() {
    const { store } = this.props;

    return (
      <Card>
        <CardContent>
          <div>
            <Typography variant="headline">
              Excel File Location:
            </Typography>
            <Typography variant="body2">
              {store.get(CONSTANTS.EXCEL_PATH) || 'N/A'}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Button size="small">Select File..</Button>
        </CardActions>
      </Card>
    );
  }
}

FileSelect.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default FileSelect;
