import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';

import CONSTANTS from '../constants';


class DriverTable extends Component {
  constructor() {
    super();
    this.state = {
      trailerSheet: {},
      jsonArray: [],
    };
  }

  componentWillMount() {
    ipcRenderer.on(CONSTANTS.EV_RECEIVE_SHEET, this.onReceiveSheet);
    ipcRenderer.send(CONSTANTS.EV_LOAD_FILE);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(CONSTANTS.EV_LOAD_FILE, this.onReceiveSheet);
  }

  onReceiveSheet = (_, arg) => {
    const x = XLSX.utils.sheet_to_json(arg, {
      range: CONSTANTS.FIRST_DATA_ROW,
      header: CONSTANTS.HEADERS,
    });

    this.setState({
      jsonArray: x,
    });
  }

  render() {
    const { jsonArray } = this.state;

    return (
      <div><pre>{JSON.stringify(jsonArray, null, 2)}</pre></div>
    );
  }
}

DriverTable.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default DriverTable;
