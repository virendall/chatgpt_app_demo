// Must be imported first to ensure Tailwind layers and style foundations are loaded
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppsSDKUIProvider } from '@openai/apps-sdk-ui/components/AppsSDKUIProvider';
import { Link } from 'react-router-dom';
import App from './App.tsx';

// Configure Apps SDK UI to use react-router-dom Link
declare global {
    interface AppsSDKUIConfig {
        LinkComponent: typeof Link;
    }
}

createRoot(document.getElementById('container')!).render(
    <StrictMode>
        <AppsSDKUIProvider linkComponent={Link}>
            <App />
        </AppsSDKUIProvider>
    </StrictMode>
);
