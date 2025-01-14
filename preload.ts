import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    joinPaths: (...paths: string[]) =>
        ipcRenderer.invoke('join-paths', ...paths),
    
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

    readTextFile: (filePath: string | null) =>
        ipcRenderer.invoke('read-text-file', filePath),
    saveLastPlayed: (fileName: string | null, data: string) =>
        ipcRenderer.send('save-last-played', fileName, data),
});
