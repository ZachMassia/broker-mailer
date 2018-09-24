import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import {
  List, ListItem, ListItemText, Card, CardActions, CardContent, Typography, Grid, Button,
} from '@material-ui/core';
import Mustache from 'mustache';

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
    ipcRenderer.removeListener(CONSTANTS.EV_RECEIVE_SHEET, this.onReceiveSheet);
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

  getBrokerTrailerList = () => {
    const brokers = this.getBrokerTrailers();

    return brokers.map(({ name, trailers }) => {
      const units = trailers.map(t => t.UNIT);

      return (
        <ListItem key={`broker-li-${name}`}>
          <ListItemText>{`${name} - ${units.toString()}`}</ListItemText>
        </ListItem>
      );
    });
  }

  sendEmailToMain = (email) => {
    ipcRenderer.send(CONSTANTS.EV_SEND_EMAIL, email);
  }

  sendEmails = () => {
    const { store } = this.props;

    const brokers = this.getBrokerTrailers();
    const template = store.get(CONSTANTS.TEMPLATE);

    const emails = brokers.map(driver => ({
      body: Mustache.render(template, driver),
      recipient: driver.email,
    }));

    emails.forEach(this.sendEmailToMain);
  }

  render() {
    const { emailRows } = this.state;
    const driverCount = emailRows.length;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="headline">Broker List</Typography>
              <List>
                {this.getBrokerTrailerList()}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="headline">Send emails</Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={this.sendEmails}
              >
                {`Send ${driverCount} emails`}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

EmailPage.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
};

export default EmailPage;
