const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFolderDialog: () => ipcRenderer.invoke('dialog:openDirectory'),
  getPathForFile: (file) => {
    try {
      if (webUtils && typeof webUtils.getPathForFile === 'function') {
        return webUtils.getPathForFile(file);
      }
      return file.path || '';
    } catch (e) {
      return file.path || '';
    }
  }
});
