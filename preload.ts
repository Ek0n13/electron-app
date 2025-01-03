import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    readTextFile: (filePath: string) =>
        ipcRenderer.invoke('read-text-file', filePath),
});
