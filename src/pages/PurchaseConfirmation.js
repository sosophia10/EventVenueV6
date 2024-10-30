import React from 'react';
import { useLocation } from 'react-router-dom';


function PurchaseConfirmation() {
    const location = useLocation();
    const { state } = location; // This will contain the purchaseData

    // Destructure the data from state
    const {
        showName,
        eventDate,
        totalTickets,
        boxTickets,
        orchestraTickets,
        mainFloorTickets,
        balconyTickets,
        totalPrice
    } = state || {}; // Use state or an empty object if undefined

    return (
        <div className="confirmation-page">
            <h1>Purchase Confirmation</h1>
            {state ? (
                <div>
                    <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                        Event: {showName.replace(/-/g, ' ')} </h3>

                    <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                        Date: {eventDate} </h3>
                    <p style={{ marginLeft: '20px' }}><strong>Total Tickets: {totalTickets}</strong></p>
                    <p style={{ marginLeft: '20px' }}>Box Tickets: {boxTickets}</p>
                    <p style={{ marginLeft: '20px' }}>Orchestra Tickets: {orchestraTickets}</p>
                    <p style={{ marginLeft: '20px' }}>Main Floor Tickets: {mainFloorTickets}</p>
                    <p style={{ marginLeft: '20px' }}>Balcony Tickets: {balconyTickets}</p>
                    <h2>Total Price: ${totalPrice?.toFixed(2)}</h2>
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
                        onClick={() => window.location.href = '/EventVenueV6'}
                    >
                        Return to Home
                    </button>
                </div>
            ) : (
                <p>No purchase data available.</p>
            )}
        </div>
    );
}
export default PurchaseConfirmation;
