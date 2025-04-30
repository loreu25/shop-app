import React from 'react';

const Cart = ({ cartItems, onRemove, onCheckout }) => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
    const handleCheckout = () => {
        localStorage.removeItem('cart');
        alert('Спасибо за покупку!');
        if (onCheckout) onCheckout();
    };
    return (
        <div>
            <h4>Корзина</h4>
            {cartItems.length === 0 ? (
                <p>Корзина пуста.</p>
            ) : (
                <>
                <ul className="list-group mb-3">
                    {cartItems.map((item, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                {item.title} <span className="text-muted">(${item.price})</span>
                            </span>
                            <button className="btn btn-sm btn-danger" onClick={() => onRemove(item.id)}>Удалить</button>
                        </li>
                    ))}
                </ul>
                <button className="btn btn-success w-100 mb-2" onClick={handleCheckout}>
                    Оформить заказ
                </button>
                </>
            )}
            <div className="fw-bold">Итого: ${total.toFixed(2)}</div>
        </div>
    );
};

export default Cart;
