import React, { createContext, useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles.css';

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState({ box: 0, orchestra: 0, mainFloor: 0, balcony: 0 }); // Initialize with default values
    const [totalPrice, setTotalPrice] = useState(0);
    const [event, setEvent] = useState(null); // store the event object
    const [error, setError] = useState(null); // handle any fetch errors
    const [loading, setLoading] = useState(true); // handle loading state
    const { eventName, eventDate } = useParams();
    const [ticketPrices, setTicketPrices] = useState(null);

    useEffect(() => {
        // Retrieve cart from local storage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        // Fetch the events data from the JSON file
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`) // Change the path accordingly
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch event data. Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Find the event that matches the eventName and eventDate
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());

                if (event) {
                    const eventDetail = event.eventDetails.find(detail => detail.date === eventDate);
                    if (eventDetail) {
                        setTicketPrices(eventDetail.ticketPrices);
                    } else {
                        setError('Event details not found for the specified date.');
                    }
                } else {
                    setError('Event not found.');
                }
            })
            .catch(err => {
                console.error(err);
                setError('Error fetching ticket prices.');
            });
    }, [eventName, eventDate]);

    useEffect(() => {
        if (cart && ticketPrices) {
            calculateTotalPrice(cart);
        }
    }, [cart, ticketPrices]);

    const calculateTotalPrice = (updatedCart) => {
        if (!ticketPrices) return;

        const total = (updatedCart.box * ticketPrices.box) +
            (updatedCart.orchestra * ticketPrices.orchestra) +
            (updatedCart.mainFloor * ticketPrices.mainFloor) +
            (updatedCart.balcony * ticketPrices.balcony);
        setTotalPrice(total);
    };

    // Function to handle changes in ticket quantities
    const handleTicketChange = (type, value) => {
        const updatedCart = {
            ...cart,
            [type]: Number(value),
        };
        setCart(updatedCart);
        calculateTotalPrice(updatedCart); // Recalculate the total price
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
    };

    // Function to handle the purchase button click
    const handlePurchase = () => {
        const totalTickets = cart.box + cart.orchestra + cart.mainFloor + cart.balcony;

        if (totalTickets === 0) {
            alert("Error: You cannot proceed with 0 tickets in your cart. Please select at least one ticket.");
            return; // Prevent the purchase process if no tickets are selected
        }

        const purchaseData = {
            showName: eventName.replace(/-/g, ' '),
            eventDate,
            totalTickets,
            ...cart,
            totalPrice,
        };

        navigate('/confirmation', { // Navigate to confirmation page
            state: {
                showName: eventName,
                eventDate: eventDate,
                totalTickets,
                boxTickets: cart.box,
                orchestraTickets: cart.orchestra,
                mainFloorTickets: cart.mainFloor,
                balconyTickets: cart.balcony,
                totalPrice
            }
        });
    };

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Event: {eventName.replace(/-/g, ' ')}
            </h3>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Date: {eventDate}
            </h3>

            {error && <p className="error">{error}</p>} {/* Display error message if any */}

            {ticketPrices ? (
                <div>
                    <h2>Tickets:</h2>
                    {["box", "orchestra", "mainFloor", "balcony"].map(type => (
                        <div key={type} className="ticket-selection">
                            <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Tickets:`}</label>
                            <select value={cart[type]} onChange={(e) => handleTicketChange(type, e.target.value)}>
                                {[...Array(11).keys()].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
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
                </div>
            ) : (
                <p>Loading ticket prices...</p>
            )}
        </div>
    );
}

export default Cart;