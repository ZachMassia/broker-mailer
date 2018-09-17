import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Home } from './Components';

export default class App extends Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <Home />
      </div>
    );
  }
}
