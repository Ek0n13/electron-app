import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    readTextFile: (filePath: string) =>
        ipcRenderer.invoke('read-text-file', filePath),
    readDirectory: (directory: string) =>
        ipcRenderer.invoke('read-directory', directory),
    openFile: (fileName: string, directory: string) =>
        ipcRenderer.send('open-file', fileName, directory),
});
