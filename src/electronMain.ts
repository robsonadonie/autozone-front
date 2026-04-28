import { app, BrowserWindow } from 'electron';
import path from 'path';

// Déclare une variable pour la fenêtre principale
let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Crée la fenêtre Electron
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // Permet l'intégration de Node.js dans le rendu
      contextIsolation: false, // Permet à Node.js de fonctionner dans le renderer (le processus qui affiche l'app React)
    },
  });

  // Charge l'application React. En développement, elle est sur ${APP_URL}
  // En production, on charge le fichier index.html de React
  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? '${APP_URL}'
      : path.join(__dirname, 'build', 'index.html')
  );

  // Ferme la fenêtre quand elle est fermée
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Quand Electron est prêt, on crée la fenêtre
app.whenReady().then(createWindow);

// Quitter l'app lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Sur macOS, recréer la fenêtre si l'app est activée
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
