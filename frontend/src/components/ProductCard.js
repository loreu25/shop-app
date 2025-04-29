import React, { useState } from 'react';
import { updateProduct, deleteProduct } from '../services/api';

const API_URL = "http://localhost:5192";

const ProductCard = ({ product, onUpdate, onDelete }) => {
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
                            ${product.price}
                        </p>
                        <div className="d-flex justify-content-center gap-2">
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
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductCard;