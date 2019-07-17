const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const windowStateKeeper = require('electron-window-state');
const contextMenu = require('electron-context-menu');
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, 'page.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'page.js'), 'utf8');
let win, tray;

const ICON = {
	dimmed: path.join(__dirname, 'icons', 'icon-menubar-dimmed.png'),
	white: path.join(__dirname, 'icons', 'icon-menubar-white.png'),
};




contextMenu({ showInspectElement: true });

ipcMain.on('unread-count', (ev, arg) => {
	const count = parseInt(arg, 10);
	tray.setImage(count > 0 ? ICON.white : ICON.dimmed);
	app.setBadgeCount(count);
});

function createWindow() {
	const mainWindowState = windowStateKeeper({ defaultWidth: 400, defaultHeight: 800 });

	win = new BrowserWindow({
		title: 'TIM3',
		icon: __dirname + '/assets/icon.png',
		titleBarStyle: 'hiddenInset',
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minHeight: 200,
		minWidth: 400,
		show: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	win.on('closed', () => (win = undefined));
	win.webContents.on('crashed', () => {
		win.destroy();
		createWindow();
	});
	mainWindowState.manage(win);

	win.loadURL('https://github.wdf.sap.corp/notifications');
	// win.loadURL('https://github.com/notifications');

	win.webContents.on('dom-ready', () => {
		win.webContents.insertCSS(css);
		win.webContents.executeJavaScript(js, true).then(res => console.log(res));
		// win.show();
	});
	// win.webContents.openDevTools();
	createTray();
}

function createTray() {
	tray = new Tray(ICON.dimmed);
	tray.on('click', () => {
		if (!win) return;
		if (win.isVisible()) win.hide();
		else win.show();
	});
}

if (!app.requestSingleInstanceLock()) app.quit(); // Prevent multiple instances of the app

app.on('second-instance', () => {
	if (!win) return;
	if (win.isMinimized()) win.restore();
	win.show();
});

app.on('window-all-closed', app.quit);
app.on('ready', createWindow);
