import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

ipcMain.handle('read-text-file', async(_event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
})

let mainWindow: BrowserWindow | null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // for secure communication
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('http://localhost:5173'); // Vite's default dev server
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
