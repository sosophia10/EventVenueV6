// CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (eventName, selectedDate, tickets) => {
        setCartItems((prevItems) => {
            const existingEventIndex = prevItems.findIndex(
                item => item.eventName === eventName && item.selectedDate === selectedDate
            );

            if (existingEventIndex > -1) {
                // Update existing event tickets
                const updatedItems = [...prevItems];
                updatedItems[existingEventIndex].tickets.push(...tickets);
                return updatedItems;
            }

            // Add new event with tickets
            return [...prevItems, { eventName, selectedDate, tickets }];
        });
    };

    const resetCart = () => setCartItems([]); // Function to reset cart

    return (
        <CartContext.Provider value={{ cartItems, addToCart, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};

