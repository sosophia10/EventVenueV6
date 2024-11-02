import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CartContext } from '../CartContext';
import '../styles.css';
import { HOME_PATH } from '../App';

function Cart() {
    const { cartItems, setCartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketPrices, setTicketPrices] = useState(null);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
            .then(response => response.json())
            .then(data => {
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());
                if (event) {
                    const eventDetail = event.eventDetails.find(detail => detail.date === eventDate);
                    if (eventDetail) {
                        setTicketPrices(eventDetail.ticketPrices);
                        setEvent(event);
                    } else {
                        setError('Event details not found for the specified date.');
                    }
                } else {
                    setError('Event not found.');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error fetching ticket prices.');
                setLoading(false);
            });
    }, [eventName, eventDate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    
    const handleTicketChange = (ticketType, quantity, eventIndex) => {
        const ticketQuantity = parseInt(quantity, 10) || 0;
        const updatedCart = [...cartItems];

        const ticketIndex = updatedCart[eventIndex].tickets.findIndex(t => t.type === ticketType);
        if (ticketQuantity > 0) {
            if (ticketIndex === -1) {
                updatedCart[eventIndex].tickets.push({
                    type: ticketType,
                    quantity: ticketQuantity,
                    price: ticketPrices[ticketType] 
                });
            } else {
                updatedCart[eventIndex].tickets[ticketIndex].quantity = ticketQuantity;
            }
        } else if (ticketIndex !== -1) {
            updatedCart[eventIndex].tickets.splice(ticketIndex, 1);
        }
    
        setCartItems(updatedCart);
    };

    const orderSummary = cartItems.map(event => ({
        eventName: event.eventName,
        eventDate: event.selectedDate,
        tickets: event.tickets.map(ticket => ({
            type: ticket.type,
            quantity: ticket.quantity,
            total: ticket.quantity * ticket.price
        }))
    }));

    // Calculate total tickets and total price
    const totalTickets = orderSummary.reduce((total, event) => {
        return total + event.tickets.reduce((eventTotal, ticket) => {
            return eventTotal + ticket.quantity;
        }, 0);
    }, 0);

    const totalPrice = cartItems.reduce((total, event) => {
        return total + event.tickets.reduce((eventTotal, ticket) => {
            return eventTotal + (ticket.quantity * ticket.price);
        }, 0);
    }, 0);

    const handlePurchase = () => {
        console.log("Order Summary:", orderSummary);
    
        const ticketsDetails = cartItems.map(event => ({
            eventName: event.eventName,
            eventDate: event.selectedDate,
            tickets: event.tickets.map(ticket => ({
                type: ticket.type,
                quantity: ticket.quantity,
                total: ticket.quantity * ticket.price // Calculate total per ticket type
            }))
        }));
    
        // Create a summary of total tickets and prices
        const totalTickets = ticketsDetails.reduce((sum, event) => sum + event.tickets.reduce((tSum, ticket) => tSum + ticket.quantity, 0), 0);
        const totalPrice = ticketsDetails.reduce((sum, event) => sum + event.tickets.reduce((tSum, ticket) => tSum + ticket.total, 0), 0);
    
        navigate('/confirmation', {
            state: {
                ticketsDetails, // Pass the details for each event's tickets
                totalTickets,
                totalPrice
            }
        });
    };

  

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                cartItems.map((event, eventIndex) => (
                    <div key={`${event.eventName}-${eventIndex}`}>
                        <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                            Event: {event.eventName.replace(/-/g, ' ')}
                        </h3>
                        <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                            Date: {event.selectedDate}
                        </h3>
                        {["box", "orchestra", "mainFloor", "balcony"].map(type => (
                            <div key={type} className="ticket-selection">
                                <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Tickets:`}</label>
                                <select
                                    value={event.tickets.find(t => t.type === type)?.quantity || 0}
                                    onChange={(e) => handleTicketChange(type, e.target.value, eventIndex)}
                                >
                                    {[...Array(11).keys()].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <br />
                    </div>
                ))
            )}
            <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
            <button
                style={{
                    display: 'block',
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF6700',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                }}
                onClick={handlePurchase}
            >
                Purchase
                </button>
                <Link to={HOME_PATH}>
                    <button
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: '#FF6700',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        Add More Tickets
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Cart;