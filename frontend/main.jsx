import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="dark">
      <Notifications position="top-right" zIndex={3000} />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
