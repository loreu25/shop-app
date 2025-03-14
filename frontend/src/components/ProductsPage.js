import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';

const ProductsPage = ({ setIsAuthenticated }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Вы не авторизованы');
                }
                const response = await fetch('http://localhost:5192/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                        navigate('/login');
                        return;
                    }
                    throw new Error('Ошибка загрузки товаров');
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchProducts();
    }, [navigate, setIsAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Товары</h2>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <ProductList products={products} />
        </div>
    );
};

export default ProductsPage;