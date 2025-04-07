import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductsPage from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setIsAuthenticated(true);
		}
    }, []);

	return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route 
                    path="/register" 
                    element={<Register setIsAuthenticated={setIsAuthenticated} />} 
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <ProductsPage setIsAuthenticated={setIsAuthenticated} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Profile setIsAuthenticated={setIsAuthenticated} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <ProductsPage setIsAuthenticated={setIsAuthenticated} />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
