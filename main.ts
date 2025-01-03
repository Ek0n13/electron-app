import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

ipcMain.handle('read-text-file', async(_event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('read-directory', async(_event, directory) => {
  try {
    const files = fs.readdirSync(directory);
    return files.filter((file) => file.endsWith(".pdf"));
  } catch (error) {
    console.error('Error reading directory:', error);
    return null;
  }
});

ipcMain.on('open-file', (_event, fileName, directory) => {
  // console.log(fileName, directory);

  const fullPath = path.join(directory, fileName);
  shell.openPath(fullPath)
    .then(() => console.log('File opened'))
    .catch((err) => console.error('Error opening file:', err));
});

let mainWindow: BrowserWindow | null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
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
