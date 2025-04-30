import React from 'react';

const Cart = ({ cartItems, onRemove, onCheckout, onUpdateQuantity }) => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
    const handleCheckout = () => {
        localStorage.removeItem('cart');

        if (onCheckout) onCheckout();
    };
    const handleQuantityChange = (id, value, stock) => {
        const quantity = Math.max(1, Math.min(stock, parseInt(value) || 1));
        if (onUpdateQuantity) onUpdateQuantity(id, quantity);
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
                                <input
                                    type="number"
                                    min={1}
                                    max={item.stock}
                                    value={item.quantity || 1}
                                    onChange={e => handleQuantityChange(item.id, e.target.value, item.stock)}
                                    style={{ width: '60px', marginLeft: '12px', marginRight: '6px' }}
                                />
                                x {item.quantity || 1}
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
