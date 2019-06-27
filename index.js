const {app, BrowserWindow, ipcMain} = require('electron');
const windowStateKeeper = require('electron-window-state');
const contextMenu = require('electron-context-menu');
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, 'page.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'page.js'), 'utf8');
let win;

contextMenu({ showInspectElement: true });

ipcMain.on('unread-count', (ev, arg) => app.setBadgeCount(parseInt(arg, 10)));


function createWindow () {
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
			nodeIntegration: true
		}

	});
	win.on('closed', () => win = undefined);
	win.webContents.on('crashed', () => { win.destroy(); createWindow(); });
	mainWindowState.manage(win);

	win.loadURL('https://github.wdf.sap.corp/notifications', {
	// win.loadURL('https://github.com/notifications', {
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
	});

	win.webContents.on('dom-ready', () => {
		win.webContents.insertCSS(css);
		win.webContents.executeJavaScript(js, true).then(res => console.log(res));
		win.show();
	});
	// win.webContents.openDevTools();
}

if (!app.requestSingleInstanceLock()) app.quit(); // Prevent multiple instances of the app

app.on('second-instance', () => {
	if (!win) return;
	if (win.isMinimized()) win.restore();
	win.show();
});

app.on('window-all-closed', app.quit);
app.on('ready', createWindow);
