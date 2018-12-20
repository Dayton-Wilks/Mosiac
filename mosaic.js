/* 
* Author: Jiawei Xu (Kevin)
* File: Mosaic.js
* Description:
*	-> Create Splash screen and Mainwindow which holds the mosaic html and javascript logic.
**/
const app = require("electron").app;
const BrowserWindow = require("electron").BrowserWindow;
const ipcMain = require("electron").ipcMain;

const fs = require("fs");
const path = require("path");
const url = require("url");

if (process.env.ELECTRON_ENV === "development") {
  const liveReload = require("electron-reload");
  liveReload(__dirname, {
    electron: path.join(__dirname, "node_modules", "electron"),
    ignored: /node_modules|helper|src|test|static|lib|[\/\\]\./
  });
}
let imagePath = './static/images/flowjoLogo.png.ico';
if (process.mas) {
  app.setName("Mosaic");
  imagePath = './static/images/flowjoLogo.png.icns';
}
let mainWindow = null;
let splashWindow = null;
const createWindow = () => {
  const shouldQuit = makeSingleInstance();
  if (shouldQuit) return app.quit();
  mainWindow = new BrowserWindow({
    resizable: true,
    frame: true,
    width: 1280,
    height: 850,
    minHeight: 500,
    minWidth: 850,
    show: false,
    icon: path.join(__dirname, imagePath),
    webPreferences: {
      nodeIntegrationInWorker: true
    },
    // icon: path.resolve(__dirname + "/static/icon/icon.png"),
    title: app.getName()
  });
  if (process.env.ELECTRON_ENV === "development") {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/index.html"), // eslint-disable-line no-undef
      protocol: "file:",
      slashes: true
    })
  );

  // this will run when the main window is loaded
  mainWindow.on("ready-to-show", () => {});

	// and load the mosaic html file.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "/index.html"), // eslint-disable-line no-undef
		protocol: "file:",
		slashes: true
	}));

	// this will run when the main window is loaded
	mainWindow.on("ready-to-show", () => {
	});

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
    const tmpFolder = path.join(app.getPath("temp"), "mosaic");
    if (fs.existsSync(tmpFolder)) removeDir(tmpFolder);
    
		mainWindow = null;
	});

	mainWindow.setMenu(null);

	if (process.env.ELECTRON_ENV === 'development') {
		const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
		installExtension(REDUX_DEVTOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));
	}
};

const createSplashWindow = () => {
  const shouldQuit = makeSingleInstance();
  if (shouldQuit) return app.quit();
  splashWindow = new BrowserWindow({
    resizable: false,
    frame: false,
    width: 350,
    height: 200,
    maxHeight: 200,
    maxWidth: 350,
    minHeight: 200,
    minWidth: 350,
    show: false,
    title: app.getName()
  });
  splashWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "helper/splash/index.html"), // eslint-disable-line no-undef
      protocol: "file:",
      slashes: true
    })
  );
  splashWindow.on("closed", () => {
    splashWindow.destroy();
    splashWindow = null;
  });
  splashWindow.on("ready-to-show", () => {
    splashWindow.show();
    createWindow();
  });

  // if (process.env.ELECTRON_ENV === 'development') {
  // 	splashWindow.webContents.openDevTools({mode: "detach"});
  // }
};

app.setName("Mosaic");

app.on("ready", () => {
  if (process.env.ELECTRON_ENV === "development") {
    const {
      default: installExtension,
      REDUX_DEVTOOLS
    } = require("electron-devtools-installer");
    installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log("An error occurred: ", err));
  }
  createSplashWindow();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null && splashWindow === null) {
    createSplashWindow();
  }
});

function makeSingleInstance() {
  if (process.mas) return false;
  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function removeDir(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        removeDir(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

ipcMain.on("sync", (e, data) => {
  if (data === "windowLoaded") {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
      }
      if (mainWindow) {
        mainWindow.show();
      }
    }, 500);
  }
});

ipcMain.on("stitched", (e, data) => {
  mainWindow.webContents.send("stitched", data);
});
