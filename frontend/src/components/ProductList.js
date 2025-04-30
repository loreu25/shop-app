import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, setProducts, onAddToCart }) => {
    const handleUpdate = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleDelete = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="container mt-4">
            <div className="row g-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-4">
                            <ProductCard
                                product={product}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                onAddToCart={onAddToCart}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p className="text-muted">Нет товаров для отображения.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;