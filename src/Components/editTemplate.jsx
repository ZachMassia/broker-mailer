import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, List, ListItem, ListItemText, Card, CardActions, CardContent, Typography, Grid,
} from '@material-ui/core';
import Mustache from 'mustache';

import CONSTANTS from '../constants';


const exampleDriver = {
  name: 'Jacques Leonard',
  trailers: [
    {
      UNIT: 'T24A/B',
      HUB_KM: 497991,
      LAST_PM_DATE: 43250,
      LAST_SAFETY_DATE: 43250,
      LAST_B620_DATE: 43249,
      LAST_5YR_DATE: 41787,
      DAYS_UNTIL_PM: -86,
      DAYS_UNTIL_SAFETY: 249,
      DAYS_UNTIL_B620: 248,
      DAYS_UNTIL_5YR: 246,
      DRIVER_NAME: 'Jacques Leonard',
    },
    {
      UNIT: 'T37A/B',
      COMMENT: 546,
      HUB_KM: 1177437,
      LAST_PM_DATE: 43312,
      LAST_SAFETY_DATE: 43334,
      LAST_B620_DATE: 43325,
      LAST_5YR_DATE: 42940,
      DAYS_UNTIL_PM: -24,
      DAYS_UNTIL_SAFETY: 333,
      DAYS_UNTIL_B620: 324,
      DAYS_UNTIL_5YR: 1399,
      DRIVER_NAME: 'Jacques Leonard',
    },
  ],
};

class EditTemplate extends Component {
  constructor() {
    super();

    this.state = {
      template: 'Hello {{name}},\n\nHere is the status update for your trailer(s):\n\n{{#trailers}}\n  -- {{{UNIT}}} -\n    PM due in {{DAYS_UNTIL_PM}} days\n    Safety due in {{DAYS_UNTIL_SAFETY}} days\n{{/trailers}}\n\nThanks,\nMacEwen Garage',
    };
  }

  componentDidMount() {
    const { store } = this.props;

    // Initial check for stored template.
    const template = store.get(CONSTANTS.TEMPLATE);
    if (template) {
      this.setState({ template });
    }
  }

  componentWillUnmount() {
    const { store } = this.props;
    const { template } = this.state;

    store.set(CONSTANTS.TEMPLATE, template);
  }

  onChange = (e) => {
    this.setState({
      template: e.target.value,
    });
  };

  getKeywordList = () => { // eslint-disable-line
    const keywords = Object.values(CONSTANTS.KEYS).filter(k => k !== CONSTANTS.KEYS.DRIVER_NAME);

    return keywords.map(_key => (
      <ListItem key={`keyword-${_key}`}>
        <ListItemText>{`{{${_key}}}`}</ListItemText>
      </ListItem>
    ));
  }

  render() {
    const { classes, store } = this.props;
    const { template } = this.state;

    let renderedEmail = '';

    try {
      renderedEmail = Mustache.render(template, exampleDriver);
    } catch (error) {
      renderedEmail = `Oops, an error occured in your email template:\n${error}`;
    }

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="headline">Edit Template</Typography>
              <TextField
                multiline
                value={template}
                rows={15}
                onChange={this.onChange}
                className={classes.textField}
                margin="normal"
                fullWidth
              />
            </CardContent>
            <CardActions>
              <Button
                onClick={() => store.set(CONSTANTS.TEMPLATE, template)}
                style={{ flex: 1 }}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="headline">
                Example Email Output
              </Typography>
              <Typography variant="body2">
                <pre>{renderedEmail}</pre>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="headline">Available keywords:</Typography>
              <List>
                {this.getKeywordList()}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

EditTemplate.propTypes = {
  store: PropTypes.object.isRequired,   // eslint-disable-line
  classes: PropTypes.object.isRequired, // eslint-disable-line
};

export default EditTemplate;
