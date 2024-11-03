// CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (eventName, eventDate, ticketsToAdd) => {
        setCartItems(prevCart => {
            const updatedCart = [...prevCart];
            const existingEventIndex = updatedCart.findIndex(item => item.eventName === eventName && item.eventDate === eventDate);
    
            if (existingEventIndex > -1) {
                const existingEvent = updatedCart[existingEventIndex];
                ticketsToAdd.forEach(ticket => {
                    const ticketIndex = existingEvent.tickets.findIndex(t => t.type === ticket.type);
                    if (ticketIndex > -1) {
                        // Update quantity for existing ticket type
                        existingEvent.tickets[ticketIndex].quantity += ticket.quantity;
                    } else {
                        // Add new ticket type
                        existingEvent.tickets.push(ticket);
                    }
                });
            } else {
                // Add new event to cart
                updatedCart.push({
                    eventName,
                    eventDate,
                    tickets: ticketsToAdd,
                });
            }
            return updatedCart;
        });
    };

    const resetCart = () => setCartItems([]); // Function to reset cart

    return (
        <CartContext.Provider value={{ cartItems, addToCart, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};

