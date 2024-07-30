// Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
    };
    
    fetchCartItems();
  }, []);

  const updateQuantity = async (id, quantity) => {
    await axios.put(`/api/cart/${id}`, { Quantity: quantity });
    const updatedCart = cartItems.map(item => item.CartID === id ? { ...item, Quantity: quantity } : item);
    setCartItems(updatedCart);
  };

  const deleteItem = async (id) => {
    await axios.delete(`/api/cart/${id}`);
    const updatedCart = cartItems.filter(item => item.CartID !== id);
    setCartItems(updatedCart);
  };

  return (
    <div className="cart">
      <h1>Cart</h1>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.CartID} className="cart-item">
            <h2>{item.Product.ProductName}</h2>
            <p>{item.Product.Description}</p>
            <p>${item.Product.BasePrice}</p>
            <input type="number" value={item.Quantity} onChange={(e) => updateQuantity(item.CartID, e.target.value)} />
            <button onClick={() => deleteItem(item.CartID)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
