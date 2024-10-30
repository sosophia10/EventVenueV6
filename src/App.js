import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Event from './pages/Event';
import Tickets from './pages/Tickets'
import Cart from './pages/Cart';
import PurchaseConfirmation from './pages/PurchaseConfirmation';
import Header from './components/Header';
import Footer from './components/Footer';


export const HOME_PATH = '/EventVenueV6';
function App() {
    return (
        <Router>
            {/*<Router basename="/EventVenueV6"> 
      {/* Header will be rendered once for all routes */}
            <Header />
            <Routes>
                <Route path={HOME_PATH} element={<Home />} />
                <Route path="/event/:eventName/:eventDate" element={<Event />} />
                <Route path="/cart/:eventName/:eventDate" element={<Cart />} />
                <Route path="/tickets/:eventName/:eventDate" element={<Tickets />} />
                <Route path="/confirmation" element={<PurchaseConfirmation />} />


                {/* Pass category as a parameter */}
                <Route path="/events/:category" element={<Home />} />
            </Routes>
            {/* Footer will be rendered once for all routes */}
            <Footer />


        </Router>
    );
}

export default App;
