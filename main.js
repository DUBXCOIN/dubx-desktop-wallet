// Modules to control application life and create native browser window
const { app, Menu, ipcMain, BrowserWindow } = require("electron");
const singleInstance = require("single-instance");
const path = require("path");
const fs = require("fs");

var locker = new singleInstance("DubxWallet");

locker
  .lock()
  .then(function () {
    mainWindow = null;

    function createWindow() {
      // Create the browser window.
      mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 650,
        backgroundColor: "#000000",
        icon: path.join(__dirname, "assets/images/gold_logo1.png"),
      });

      // and load the index.html of the app.
      mainWindow.loadFile("index.html");
      DUBXGdubx.startGdubx();

      // Open the DevTools.
      // mainWindow.webContents.openDevTools()

      mainWindow.on("closed", function () {
        mainWindow = null;
      });

      require("./modules/menu.js");
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", createWindow);

    // Quit when all windows are closed.
    app.on("window-all-closed", function () {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== "darwin") {
        DUBXGdubx.stopGdubx();
        app.quit();
      }
    });

    app.on("activate", function () {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        createWindow();
      }
    });

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.
    // listen for request to get template

    // get the template content from file
    ipcMain.on("getTemplateContent", (event, arg) => {
      event.returnValue = fs.readFileSync(
        path.join(app.getAppPath(), "assets/templates/") + arg,
        "utf8"
      );
    });

    // quit the app on coomand
    ipcMain.on("appQuit", (event, arg) => {
      app.quit();
    });
  })
  .catch(function (err) {
    app.quit();
  });

require("./modules/gdubx.js");
require("./modules/accounts.js");
require("./modules/database.js");
