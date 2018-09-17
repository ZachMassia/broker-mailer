import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import ElectronStore from 'electron-store';

import { Home } from './Components';

const store = new ElectronStore();

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
