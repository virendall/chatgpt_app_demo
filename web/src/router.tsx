import { createHashRouter, Navigate } from 'react-router-dom';
import {
    LandingPage,
    PlanBenefitsPage,
    FindDoctorPage,
    ClaimsPage,
    PrescriptionsPage,
} from './pages';

// Extend Window interface for initial route injection from MCP resource
declare global {
    interface Window {
        __INITIAL_ROUTE__?: string;
    }
}

// Get initial route from window (injected by MCP resource HTML)
const initialRoute = window.__INITIAL_ROUTE__;

// Component to handle initial route redirect
function InitialRouteRedirect() {
    if (initialRoute && initialRoute !== '/') {
        return <Navigate to={initialRoute} replace />;
    }
    return <LandingPage />;
}

// Using HashRouter for compatibility with static file serving
// Change to createBrowserRouter if using a server with proper routing
export const router = createHashRouter([
    {
        path: '/',
        element: <InitialRouteRedirect />,
    },
    {
        path: '/plan-benefits',
        element: <PlanBenefitsPage />,
    },
    {
        path: '/find-doctor',
        element: <FindDoctorPage />,
    },
    {
        path: '/claims',
        element: <ClaimsPage />,
    },
    {
        path: '/prescriptions',
        element: <PrescriptionsPage />,
    },
]);
