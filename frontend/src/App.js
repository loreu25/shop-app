import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5192/api/product')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <Header />
      <ProductList products={products} />
    </>
  );
}

export default App;
