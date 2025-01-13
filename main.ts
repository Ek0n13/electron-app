import { app, BrowserWindow, ipcMain, shell, dialog, screen } from 'electron';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

//initialization
let mainWindow: BrowserWindow | null;

app.on('ready', () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const cWidth: number = Math.ceil(width*0.9);
  const cHeight: number = Math.ceil(height*0.9);

  mainWindow = new BrowserWindow({
    width: cWidth,
    height: cHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // for secure communication
      contextIsolation: true,
    },
    resizable: false,
  });

  if (app.isPackaged) {
    mainWindow.loadFile('./dist/index.html');
  } else {
    mainWindow.loadURL('http://localhost:5173'); // Vite's default dev server
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//custom functions
ipcMain.handle('read-text-file', async(_event, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('directory-dialog', async(_event) => {
  try {
    const dialogResult = dialog.showOpenDialogSync({
      properties: [
        "openDirectory",
      ],
      // filters: [
      //   { name: 'PDF Files', extensions: ['pdf'] }
      // ]
    });

    if (!dialogResult) return null;

    if (dialogResult?.length != 1) throw new Error("Only a single directory is allowed");

    return dialogResult[0];
  } catch (error) {
    console.error('Error reading directory:', error);
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

ipcMain.handle('get-child-directories', async(_event, directory) => {
  try {
    if (!directory) return null;

    const childDirs = fs.readdirSync(directory).filter((child) => {
      return fs.statSync(path.join(directory, child)).isDirectory();
    });

    return childDirs;
  } catch (error) {
    console.error('Error finding child directories:', error);
    return null;
  }
});

ipcMain.on('open-file', (_event, fileName: string, directory) => {
  const fullPath = path.join(directory, fileName);
  shell.openPath(fullPath)
    .then(() => console.log('File opened'))
    .catch((err) => console.error('Error opening file:', err));
});

ipcMain.on('file-yt-search', (_event, fileString: string) => {
  const strippedFileName = path.parse(fileString).name.trim();

  const searchString = strippedFileName
    .replace(/&/g, '%26')
    .replace(/\'/g, '')
    .replace(/\"/g, '')
    .replace(/ /g, '+')
    .trim();

  const finalUrl = `https://www.youtube.com/results?search_query=${searchString}+hq`
  
  openInEdge(finalUrl);
});

ipcMain.handle('join-paths', async(_event, ...paths) => {
  try {
    return path.join(...paths); 
  } catch (error) {
    console.error('Error finding child directories:', error);
    return null;
  }
});

function openInEdge(url: string): void {
  const msedgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  if (!fs.existsSync(msedgePath)) {
    const result = dialog.showMessageBoxSync({
      message: 'Microsoft Edge not found.\nOpen in default browser?',
      
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 0,
      cancelId: 1,
      title: 'Confirm Action',
    });
    
    if (result === 0) {
      shell.openExternal(url);
    }

    return;
  }
  
  exec(`"${msedgePath}" "${url}"`, (error) => {
    if (!error) return;
    console.error("Failed to open URL in Edge:", error.message);
  });
}
