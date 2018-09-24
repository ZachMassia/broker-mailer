import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';

import CONSTANTS from '../constants';


class EmailPage extends Component {
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
      emailRows: XLSX.utils.sheet_to_json(emailSheet, {
        range: CONSTANTS.FIRST_EMAIL_ROW,
        header: CONSTANTS.EMAIL_HEADERS,
      }),
    });
  }

  getBrokerTrailers = () => {
    const { trailerRows, emailRows } = this.state;

    return emailRows.map(driver => ({
      name: driver[CONSTANTS.EMAIL_KEYS.NAME],
      email: driver[CONSTANTS.EMAIL_KEYS.EMAIL],
      trailers: trailerRows.filter((trailer) => { // eslint-disable-line
        return driver[CONSTANTS.EMAIL_KEYS.NAME] === trailer[CONSTANTS.KEYS.DRIVER_NAME];
      }),
    }));
  }

  render() {
    const { trailerRows, emailRows } = this.state;

    return (
      <div>
        <div><pre>{JSON.stringify(this.getBrokerTrailers(), null, 2)}</pre></div>
        <div><pre>{JSON.stringify(emailRows, null, 2)}</pre></div>
        <div><pre>{JSON.stringify(trailerRows, null, 2)}</pre></div>
      </div>
    );
  }
}

EmailPage.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default EmailPage;
