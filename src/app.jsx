import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Store from 'electron-store';

import { Home } from './Components';

const store = new Store();

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
