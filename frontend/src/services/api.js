const API_URL = 'http://localhost:5192';

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка входа');
    }
    return response.json();
};

export const register = async (username, email, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
    }
    return response.json();
};

export const getUser = async (token) => {
    const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось загрузить данные пользователя');
    }
    return response.json();
};

export const getProducts = async (token) => {
    const response = await fetch(`${API_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось загрузить товары');
    }
    return response.json();
};

// Обновить stock товара
export const updateProductStock = async (product, token) => {
    const response = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            image: product.image || "",
            stock: product.stock
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при обновлении товара');
    }
    return response.json();
};

export const createProduct = async (formData, token) => {
    const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Content-Type не указываем, браузер сам выставит boundary для FormData
        },
        body: formData
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось добавить товар');
    }
    return response.json();
};

export const updateProduct = async (id, product, token) => {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось обновить товар');
    }
    return response.json();
};

export const deleteProduct = async (id, token) => {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось удалить товар');
    }
    return response.json();
};