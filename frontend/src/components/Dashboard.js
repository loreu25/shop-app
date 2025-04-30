import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Добавляем Link для перехода
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import { getProducts, createProduct, updateProductStock } from '../services/api';

const Dashboard = ({ setIsAuthenticated }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '', description: '', stock: 0 });
    const [showModal, setShowModal] = useState(false); // Состояние для модального окна
    const [showCart, setShowCart] = useState(false); // Состояние корзины
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Загружаем корзину из localStorage при монтировании
        if (role === 'customer') {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(cart);
        }
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
            const formData = new FormData();
            formData.append('title', newProduct.name);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description || '');
            formData.append('stock', newProduct.stock);
            if (newProduct.image) {
                formData.append('image', newProduct.image);
            }
            const createdProduct = await createProduct(formData, token);
            setProducts([...products, createdProduct]);
            console.log('Созданный товар:', createdProduct);
            setNewProduct({ name: '', price: 0, image: null, description: '', stock: 0 });
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

    // Получаем роль пользователя из localStorage
    const role = localStorage.getItem('role');

    // Удалить товар из корзины
    const handleRemoveFromCart = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Добавить товар в корзину
    const handleAddToCart = (product, quantity) => {
        if (product.stock <= 0) {
            alert('Товар закончился!');
            return;
        }
        const existing = cartItems.find(item => item.id === product.id);
        let updatedCart;
        if (existing) {
            // Обновляем количество, но не превышаем stock
            updatedCart = cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                    : item
            );
        } else {
            updatedCart = [...cartItems, { ...product, quantity: quantity }];
        }
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        alert('Добавлено в корзину!');
    };

    // Обработчик покупки: уменьшить stock у товаров
    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        try {
            // Для каждого товара из корзины отправить запрос на сервер
            for (const cartItem of cartItems) {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    await updateProductStock({
                        ...product,
                        stock: product.stock - cartItem.quantity
                    }, token);
                }
            }
            // Обновить список товаров с сервера
            const data = await getProducts(token);
            setProducts(data);
            setCartItems([]);
            setShowCart(false);
            localStorage.setItem('cart', '[]');
            alert('Покупка совершена!');
        } catch (error) {
            alert('Ошибка при оформлении заказа: ' + error.message);
        }
    };



    // Обработчик изменения количества товара в корзине
    const handleUpdateQuantity = (id, quantity) => {
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Товары</h2>
                <div>
                    {role === 'admin' && (
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => setShowModal(true)}
                        >
                            Добавить товар
                        </button>
                    )}
                    {role === 'customer' && (
                        <button
                            className="btn btn-warning me-2"
                            style={{ color: '#fff', fontWeight: 'bold' }}
                            onClick={() => setShowCart(true)}
                        >
                            Корзина
                        </button>
                    )}
                    <Link to="/profile" className="btn btn-info me-2" style={{ color: '#fff', fontWeight: 'bold' }}>
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

            {/* Модальное окно только для admin */}
            {role === 'admin' && (
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
                                            step="0.01"
                                            className="form-control"
                                            id="price"
                                            value={newProduct.price}
                                            onChange={(e) => {
                                                const value = e.target.value;
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
                                        <label htmlFor="stock" className="form-label">В наличии</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="stock"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Изображение</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            accept="image/*"
                                            onChange={e => setNewProduct({ ...newProduct, image: e.target.files[0] })}
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
            )}
            {role === 'customer' && showCart && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Корзина</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCart(false)}></button>
                            </div>
                            <div className="modal-body">
                                <Cart 
                                    cartItems={cartItems} 
                                    onRemove={handleRemoveFromCart} 
                                    onCheckout={handleCheckout}
                                    onUpdateQuantity={handleUpdateQuantity}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ProductList products={products} setProducts={setProducts} onAddToCart={handleAddToCart} />
        </div>
    );
};

export default Dashboard;