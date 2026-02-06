import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { DevToolbar } from './components/DevToolbar';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <DevToolbar />
        </>
    );
}

export default App;
