const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const URL_APP = 'https://shop.alphablue.digital/';
if (!app.requestSingleInstanceLock()) app.quit();
let win;
function create() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({ width: 1200, height: 800, minWidth: 380, minHeight: 560, title: 'Dukaan Manager', icon: path.join(__dirname, 'icon-app.png'), backgroundColor: '#faf8f5', webPreferences: { contextIsolation: true, sandbox: true } });
  win.loadURL(URL_APP);
  win.webContents.on('did-fail-load', (e, code, desc, url, isMain) => { if (isMain && code !== -3) win.loadFile(path.join(__dirname, 'offline.html')); });
  // links to other sites (WhatsApp etc.) open in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => { if (!url.startsWith(URL_APP)) shell.openExternal(url); return { action: url.startsWith(URL_APP) ? 'allow' : 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(URL_APP) && !url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); } });
}
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
