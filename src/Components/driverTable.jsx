import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';

import CONSTANTS from '../constants';


class DriverTable extends Component {
  constructor() {
    super();
    this.state = {
      trailerRows: [],
      emailRows: [],
    };
  }

  componentWillMount() {
    ipcRenderer.on(CONSTANTS.EV_RECEIVE_SHEET, this.onReceiveSheet);
    ipcRenderer.send(CONSTANTS.EV_LOAD_FILE);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(CONSTANTS.EV_LOAD_FILE, this.onReceiveSheet);
  }

  onReceiveSheet = (_, { trailerSheet, emailSheet }) => {
    const trailers = XLSX.utils.sheet_to_json(trailerSheet, {
      range: CONSTANTS.FIRST_DATA_ROW,
      header: CONSTANTS.HEADERS,
    });

    this.setState({
      trailerRows: trailers,
      emailRows: XLSX.utils.sheet_to_json(emailSheet),
    });
  }

  render() {
    const { trailerRows, emailRows } = this.state;

    return (
      <div>
        <div><pre>{JSON.stringify(emailRows, null, 2)}</pre></div>
        <div><pre>{JSON.stringify(trailerRows, null, 2)}</pre></div>
      </div>
    );
  }
}

DriverTable.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default DriverTable;
