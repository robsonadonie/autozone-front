
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import { storeRedux } from './redux/store/store.ts';

createRoot(document.getElementById("root")!).render(
  <Provider store={storeRedux}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
