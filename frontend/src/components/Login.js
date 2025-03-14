import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const url = isLogin ? 'http://localhost:5192/api/auth/login' : 'http://localhost:5192/api/auth/register';
            const body = isLogin
                ? { email, password }
                : { username, email, password };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.token || data.message === 'Пользователь успешно зарегистрирован') {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    setIsAuthenticated(true);
                    navigate('/products');
                } else {
                    setIsLogin(true);
                }
            } else {
                setError(data.message || 'Ошибка');
            }
        } catch (err) {
            setError('Ошибка сервера. Проверьте подключение или попробуйте позже.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default Login;