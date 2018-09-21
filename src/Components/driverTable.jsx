import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants';


class DriverTable extends Component {
  constructor() {
    super();
    this.setState({
      trailerSheetJSON: {},
    });
  }

  componentWillMount() {
    ipcRenderer.send(CONSTANTS.EV_LOAD_FILE);
  }

  onReceiveJSON = (_, arg) => {
    this.setState({
      trailerSheetJSON: arg,
    });
  }

  render() {
    const { trailerSheetJSON } = this.state;

    return (
      <p>{trailerSheetJSON}</p>
    );
  }
}

DriverTable.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default DriverTable;
