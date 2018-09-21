import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants';


class DriverTable extends Component {
  constructor() {
    super();
    this.state = {
      trailerSheetJSON: {},
    };

    ipcRenderer.on(CONSTANTS.EV_RECEIVE_JSON, this.onReceiveJSON);
  }

  componentWillMount() {
    ipcRenderer.send(CONSTANTS.EV_LOAD_FILE);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(CONSTANTS.EV_LOAD_FILE, this.onReceiveJSON);
  }

  onReceiveJSON = (_, arg) => {
    this.setState({
      trailerSheetJSON: arg,
    });

    console.log("Received JSON:\n" + arg);
  }

  render() {
    const { trailerSheetJSON } = this.state;

    return (
      <div><pre>{JSON.stringify(trailerSheetJSON, null, 2) }</pre></div>
    );
  }
}

DriverTable.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default DriverTable;
