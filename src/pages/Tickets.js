import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';

function Tickets() {
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();

    const [boxTickets, setBoxTickets] = useState(0);
    const [orchestraTickets, setOrchestraTickets] = useState(0);
    const [mainFloorTickets, setMainFloorTickets] = useState(0);
    const [balconyTickets, setBalconyTickets] = useState(0);
    const [ticketPrices, setTicketPrices] = useState(null); // State to hold ticket prices
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        // Fetch ticket prices from the JSON file
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket prices');
                }
                return response.json();
            })
            .then(data => {
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());

                if (event) {
                    // Assuming the ticketPrices are in the event's details
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

    const handleAddToCart = () => {
        const cart = {
            box: boxTickets,
            orchestra: orchestraTickets,
            mainFloor: mainFloorTickets,
            balcony: balconyTickets
        };
        const totalTickets = boxTickets + orchestraTickets + mainFloorTickets + balconyTickets;

        // Check if total tickets selected is more than 0
        if (totalTickets === 0) {
            alert("Please select one or more tickets to add tickets to the cart.");
            return;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
    };

    return (
        <div className="tickets-page">
            <h1>Select Your Tickets</h1>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Event: {eventName.replace(/-/g, ' ')} </h3>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Date: {eventDate} </h3>

            {error && <p className="error">{error}</p>} {/* Display error if any */}

            {ticketPrices ? ( // Render ticket options if prices are available
                <>
                    <div className="ticket-option">
                        <label>Box Tickets (${ticketPrices.box.toFixed(2)} each):</label>
                        <select value={boxTickets} onChange={(e) => setBoxTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Orchestra Tickets (${ticketPrices.orchestra.toFixed(2)} each):</label>
                        <select value={orchestraTickets} onChange={(e) => setOrchestraTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Main Floor Tickets (${ticketPrices.mainFloor.toFixed(2)} each):</label>
                        <select value={mainFloorTickets} onChange={(e) => setMainFloorTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Balcony Tickets (${ticketPrices.balcony.toFixed(2)} each):</label>
                        <select value={balconyTickets} onChange={(e) => setBalconyTickets(Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

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
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </>
            ) : (
                <p>Loading ticket prices...</p> // Loading message while fetching data
            )}
        </div>
    );
}

export default Tickets;
