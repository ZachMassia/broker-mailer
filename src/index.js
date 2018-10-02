import {
  app, BrowserWindow, ipcMain, dialog,
} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import Store from 'electron-store';
import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import CONSTANTS from './constants';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const store = new Store({ name: CONSTANTS.STORE_FILENAME });

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });


const auth = store.get(CONSTANTS.EMAIL_AUTH);

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  auth,
  tls: { ciphers: 'SSLv3' },
  logger: true,
});


const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({ show: false });
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.show();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(CONSTANTS.EV_OPEN_FILE_DIALOG, (event) => {
  dialog.showOpenDialog(
    { properties: ['openFile'] },
    (filePaths) => {
      if (filePaths) {
        store.set(CONSTANTS.EXCEL_PATH, filePaths[0]);
        event.sender.send(CONSTANTS.EV_PATH_UPDATED, filePaths[0]);
      }
    },
  );
});

ipcMain.on(CONSTANTS.EV_SEND_EMAILS, (_, emails) => {
  // Update the auth incase credentials changed since startup.
  transporter.auth = store.get(CONSTANTS.EMAIL_AUTH);

  const createEmailPromise = ({ body, recipient }) => transporter.sendMail({
    to: 'zmassia@gmail.com',
    from: transporter.auth.user,
    text: body,
    subject: `Test email [meant for ${recipient}`,
  });

  transporter.verify()
    .then(() => {
      Promise.all(emails.map(createEmailPromise)).then((res) => {
        const successfulSends = res.filter(({ rejected }) => rejected.length === 0);

        dialog.showMessageBox({
          type: 'info',
          title: 'Success sending emails!',
          message: `Sent ${successfulSends} emails without error.`,
        });
      }).catch(Err => dialog.showErrorBox('Error sending emails', Err));
    })
    .catch(Err => dialog.showErrorBox('Error authenticating', Err));
});

ipcMain.on(CONSTANTS.EV_LOAD_FILE, (event) => {
  const path = store.get(CONSTANTS.EXCEL_PATH);

  if (path) {
    const workbook = XLSX.readFile(path);

    event.sender.send(CONSTANTS.EV_RECEIVE_SHEET, {
      trailerSheet: workbook.Sheets[CONSTANTS.SHEET_NAMES.TRAILERS],
      emailSheet: workbook.Sheets[CONSTANTS.SHEET_NAMES.DRIVER_EMAILS],
    });
  }
});
