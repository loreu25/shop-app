import React, { useState } from 'react';
import { updateProduct, deleteProduct } from '../services/api';

const API_URL = "http://localhost:5192";

const ProductCard = ({ product, onUpdate, onDelete, onAddToCart }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({ ...product });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedProduct = await updateProduct(product.id, editedProduct, token);
            onUpdate(updatedProduct);
            setIsEditing(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await deleteProduct(product.id, token);
            onDelete(product.id);
        } catch (err) {
            console.error(err.message);
        }
    };

    // Получаем роль пользователя из localStorage
    const role = localStorage.getItem('role');

    return (
        <div className="card" style={{ width: '18rem', marginBottom: '20px', border: '1px solid #ddd' }}>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={editedProduct.title}
                            onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
                            required
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={editedProduct.description}
                            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                            required
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                        <input
                            type="number"
                            step="0.01"
                            className="form-control mb-2"
                            value={editedProduct.price}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                    setEditedProduct({ ...editedProduct, price: '' });
                                } else {
                                    const parsed = parseFloat(value);
                                    setEditedProduct({ ...editedProduct, price: isNaN(parsed) ? 0 : parsed });
                                }
                            }}
                            required
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                        <input
                            type="number"
                            className="form-control mb-2"
                            value={editedProduct.stock}
                            min={0}
                            onChange={e => setEditedProduct({ ...editedProduct, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                            required
                            placeholder="В наличии"
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={editedProduct.image}
                            onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
                            required
                            style={{ padding: '8px', fontSize: '14px' }}
                        />
                        <div className="d-flex justify-content-center gap-2">
                            <button
                                type="submit"
                                className="btn btn-success btn-sm"
                                style={{ padding: '6px 12px', fontSize: '14px' }}
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setIsEditing(false)}
                                style={{ padding: '6px 12px', fontSize: '14px' }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <>
                    <img
                        src={product.image && product.image.startsWith('/images') ? API_URL + product.image : product.image}
                        className="card-img-top"
                        alt={product.title}
                        style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-price" style={{ fontSize: '24px' }}>
                            <b>${product.price}</b>
                        </p>
                        {product.stock === 0 && (
                            <div className="alert alert-warning text-center p-1 mb-2" style={{ fontSize: '14px' }}>
                                Нет в наличии
                            </div>
                        )}
                        <p className="text-muted mb-2">В наличии: {product.stock}</p>
                        <div className="d-flex justify-content-center gap-2">
                            {role === 'admin' && (
                                <>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setIsEditing(true)}
                                        style={{ padding: '6px 12px', fontSize: '14px' }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={handleDelete}
                                        style={{ padding: '6px 12px', fontSize: '14px' }}
                                    >
                                        Удалить
                                    </button>
                                </>
                            )}
                            {role === 'customer' && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => onAddToCart(product)}
                                    disabled={product.stock === 0}
                                >
                                    В корзину
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Компонент для выбора количества и добавления в корзину (только для customer)
const CustomerCartControls = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = React.useState(1);
    const max = product.stock || 1;
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
                type="number"
                min={1}
                max={max}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(max, parseInt(e.target.value) || 1)))}
                style={{ width: '60px', fontSize: '14px' }}
                disabled={max === 0}
            />
            <button
                className="btn btn-success btn-sm"
                onClick={() => onAddToCart(product, quantity)}
                style={{ padding: '6px 12px', fontSize: '14px' }}
                disabled={max === 0}
            >
                {max === 0 ? 'Нет в наличии' : 'В корзину'}
            </button>
        </div>
    );
};

export default ProductCard;