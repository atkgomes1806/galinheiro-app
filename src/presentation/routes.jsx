import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GalinhasPage from './pages/GalinhasPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GalinhasPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;