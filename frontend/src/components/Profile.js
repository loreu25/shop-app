import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

const Profile = ({ setIsAuthenticated }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен не найден');
                }
                const data = await getUser(token);
                setUser(data);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('401')) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            }
        };
        fetchUser();
    }, [navigate, setIsAuthenticated]);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Профиль</h2>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {user ? (
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Информация о пользователе</h4>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );
};

export default Profile;