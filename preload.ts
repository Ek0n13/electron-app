import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    readTextFile: (filePath: string) =>
        ipcRenderer.invoke('read-text-file', filePath),
    readDirectory: (directory: string) =>
        ipcRenderer.invoke('read-directory', directory),
    directoryDialog: () =>
        ipcRenderer.invoke('directory-dialog'),

    openFile: (fileName: string, directory: string) =>
        ipcRenderer.sendSync('open-file', fileName, directory),
    fileYTSearch: (fileString: string) =>
        ipcRenderer.sendSync('file-yt-search', fileString),
});
