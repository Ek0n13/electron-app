import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    joinPaths: (...paths: string[]) =>
        ipcRenderer.invoke('join-paths', ...paths),

    readTextFile: (filePath: string) =>
        ipcRenderer.invoke('read-text-file', filePath),
    readDirectory: (directory: string) =>
        ipcRenderer.invoke('read-directory', directory),
    directoryDialog: () =>
        ipcRenderer.invoke('directory-dialog'),
    getChildDirectories: (directory: string) =>
        ipcRenderer.invoke('get-child-directories', directory),

    openFile: (fileName: string, directory: string) =>
        ipcRenderer.send('open-file', fileName, directory),
    fileYTSearch: (fileString: string) =>
        ipcRenderer.send('file-yt-search', fileString),
});
