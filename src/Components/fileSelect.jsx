import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Card, CardActions, CardContent, Button,
} from '@material-ui/core';

import CONSTANTS from '../constants';

class FileSelect extends Component {
  constructor() {
    super();
    this.state = {
      filePath: '',
    };

    // Register to the filePath updates inside the store.
    // Any changes made to store from the main side will be caught by this.
    ipcRenderer.on(CONSTANTS.EV_PATH_UPDATED, this.onIpcEvent);
  }

  componentDidMount() {
    const { store } = this.props;

    // Initial check for stored path.
    const path = store.get(CONSTANTS.EXCEL_PATH);
    if (path) {
      this.setState({ filePath: path });
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(CONSTANTS.EV_PATH_UPDATED, this.onIpcEvent);
  }

  onIpcEvent = (_, arg) => {
    this.setState({ filePath: arg });
  }

  render() {
    const { filePath } = this.state;

    return (
      <Card>
        <CardContent>
          <div>
            <Typography variant="headline">
              Excel File Location:
            </Typography>
            <Typography variant="body2">
              {filePath}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => ipcRenderer.send(CONSTANTS.EV_OPEN_FILE_DIALOG, 'data_str')}
          >
            Set file..
          </Button>
        </CardActions>
      </Card>
    );
  }
}

FileSelect.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default FileSelect;
