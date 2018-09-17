import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  AppBar, Drawer, Toolbar, Typography, Divider, IconButton, withStyles, ListItem, ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SettingsIcon from '@material-ui/icons/Settings';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

import Settings from './settings';
import DriverTable from './driverTable';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed.
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
});

const DrawerItem = ({ onClick, icon, text, selected }) => ( // eslint-disable-line
  <ListItem button onClick={onClick} selected={selected}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

DrawerItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

class Home extends Component {
  navItems = [
    {
      key: 'navItem-sendEmails',
      text: 'Send Emails',
      icon: <SwapHorizIcon />,
      component: DriverTable,
    },
    /*
    {
      key: 'navItem-driverInfo',
      text: 'Driver Info',
      icon: <AccountBoxIcon />,
      component: <DriverTable />,
    },
    */
    {
      key: 'navItem-settings',
      text: 'Settings',
      icon: <SettingsIcon />,
      component: Settings,
    },
  ];

  constructor() {
    super();

    this.state = {
      open: true,
      selectedItem: 0,
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  }

  handleDrawerClose = () => {
    this.setState({ open: false });
  }

  InjectStore = Comp => <Comp {...this.props} store={this.props.store} /> // eslint-disable-line

  render() {
    const { classes } = this.props;
    const { open, selectedItem } = this.state;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  open && classes.menuButtonHidden,
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                Broker Mailer
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            {
              this.navItems.map((item, i) => (
                <DrawerItem
                  {...item}
                  onClick={() => this.setState({ selectedItem: i })}
                  selected={selectedItem === i}
                />
              ))
            }
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {this.InjectStore(this.navItems[selectedItem].component)}
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withStyles(styles)(Home);
