import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    readTextFile: (filePath: string) =>
        ipcRenderer.invoke('read-text-file', filePath),
    readDirectory: (directory: string) =>
        ipcRenderer.invoke('read-directory', directory),
    directoryDialog: () =>
        ipcRenderer.invoke('directory-dialog'),

    openFile: (fileName: string, directory: string) =>
        ipcRenderer.send('open-file', fileName, directory),
    fileYTSearch: (fileString: string) =>
        ipcRenderer.send('file-yt-search', fileString),
    // showContextMenu: (x: number, y: number) =>
    //     ipcRenderer.sendSync('show-context-menu', { x, y }),
});
