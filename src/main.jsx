import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { QuioscoProvider } from './context/QuioscoProvider'; // ✅ Corrección aquí
import router from './router';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuioscoProvider>
      <RouterProvider router={router} />
    </QuioscoProvider>
  </StrictMode>
);
