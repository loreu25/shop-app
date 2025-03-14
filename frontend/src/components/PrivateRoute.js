import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated && !token) {
            navigate('/login');
        }
    }, [isAuthenticated, token, navigate]);

    return (isAuthenticated || token) ? children : null;
};

export default PrivateRoute;