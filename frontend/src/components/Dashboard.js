import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Добавляем Link для перехода
import ProductList from '../components/ProductList';
import { getProducts, createProduct } from '../services/api';

const Dashboard = ({ setIsAuthenticated }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '' });
    const [showModal, setShowModal] = useState(false); // Состояние для модального окна
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Токен не найден');
                }
                const data = await getProducts(token);
                console.log('Полученные товары:', data);
                setProducts(data);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('401')) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [navigate, setIsAuthenticated]);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const createdProduct = await createProduct(newProduct, token);
            setProducts([...products, createdProduct]);
            console.log('Созданный товар:', createdProduct);
            setNewProduct({ name: '', price: 0, image: '', description: '' });
            setShowModal(false); // Закрываем модальное окно
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаляем токен
        setIsAuthenticated(false); // Обновляем состояние аутентификации
        navigate('/login'); // Перенаправляем на страницу входа
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Товары</h2>
                <div>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => setShowModal(true)}
                    >
                        Добавить товар
                    </button>
                    <Link to="/profile" className="btn btn-outline-secondary me-2">
                        Перейти в профиль
                    </Link>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            )}

            {/* Модальное окно */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Добавить новый товар</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleCreateProduct}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Название</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Описание</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                <label htmlFor="price" className="form-label">Цена ($)</label>
                                    <input
                                        type="number"
                                        step="0.01" // Позволяет вводить дробные числа
                                        className="form-control"
                                        id="price"
                                        value={newProduct.price}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Если поле пустое, устанавливаем пустую строку
                                            if (value === '') {
                                                setNewProduct({ ...newProduct, price: '' });
                                            } else {
                                                const parsed = parseFloat(value);
                                                setNewProduct({ ...newProduct, price: isNaN(parsed) ? 0 : parsed });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">URL изображения</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="image"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Добавление...' : 'Добавить'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <ProductList products={products} setProducts={setProducts} />
        </div>
    );
};

export default Dashboard;