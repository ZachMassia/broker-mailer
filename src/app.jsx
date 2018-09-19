import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Store from 'electron-store';

import { Home } from './Components';
import CONSTANTS from './constants';

const store = new Store({ name: CONSTANTS.STORE_FILENAME });

export default class App extends Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <Home store={store} />
      </div>
    );
  }
}
