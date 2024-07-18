const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  var mainWindow = new BrowserWindow({
    width: 464,
    height: 750,
    icon: path.join(__dirname, 'icon.ico'),
    //autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: false,
    },
  });

  mainWindow.on("closed", () => {
    // 在窗口对象被关闭时，取消订阅所有与该窗口相关的事件
    mainWindow.removeAllListeners();
    mainWindow = null;
  });
  
  var timer = setInterval(function () {
    if(mainWindow != null){
      // 让窗口获得焦点
      mainWindow.focus();
    }
  }, 500);

  // 创建菜单
  const menu = Menu.buildFromTemplate([
    {
      label: 'Window',
      submenu: [
        {
          label: 'Always on Top',
          type: 'checkbox', // This makes it a checkbox menu item
          id: 'alwaysOnTop',
          checked: false, // Initial state (unchecked)
          click: () => {
            const alwaysOnTop = Menu.getApplicationMenu().getMenuItemById('alwaysOnTop');
            // Toggle the checked state
            //alwaysOnTop.checked = !alwaysOnTop.checked;
            // Set the window's always-on-top property
            mainWindow.setAlwaysOnTop(alwaysOnTop.checked);
          },
        },

        /*
        {
          label: 'Turn On Always On Top',
          id: 'alwaysOnTopOn',

          click: () => {
            //const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
            mainWindow.setAlwaysOnTop(true);
            // 更改子菜单标签
            Menu.getApplicationMenu().getMenuItemById('alwaysOnTopOn').visible = false;  
            Menu.getApplicationMenu().getMenuItemById('alwaysOnTopOff').visible = true;  

          },
        },
        {
          label: 'Turn Off Always On Top',
          id: 'alwaysOnTopOff',
          visible: false,
          click: () => {
            
            
            //const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
            mainWindow.setAlwaysOnTop(false);
            // 更改子菜单标签
            Menu.getApplicationMenu().getMenuItemById('alwaysOnTopOff').visible = false;
            Menu.getApplicationMenu().getMenuItemById('alwaysOnTopOn').visible = true; 
            

          },
        }*/
      ],
    },
  ]);

   // 设置应用程序菜单
   Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
