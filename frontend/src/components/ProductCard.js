import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div class="card" style={{width: '18rem' }}>
      <img src={product.image}  class="card-img-top" alt={product.title} />
      <div class="card-body">
        <h5 class="card-title">{product.title}</h5>
        <p class="card-text">{product.description}</p>
        <p class="card-price" style={{ fontSize: '24px' }}>${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;