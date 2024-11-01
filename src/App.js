import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link, useParams} from 'react-router-dom';
import Home from './pages/Home';
import Event from './pages/Event';
import Tickets from './pages/Tickets'
import Cart from './pages/Cart';
import PurchaseConfirmation from './pages/PurchaseConfirmation';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles.css';


export const HOME_PATH = '/EventVenueV6';
function App() {

    const [navigationHistory, setNavigationHistory] = useState([]);

  
    return (
      <Router>
          <AppContent navigationHistory={navigationHistory} setNavigationHistory={setNavigationHistory} />
      </Router>
  );
}

function AppContent({ navigationHistory, setNavigationHistory }) {
    const location = useLocation();

    useEffect(() => {
        setNavigationHistory((prevHistory) => {
            const newPage = location.pathname;
            // Check if user is on the home page; if so, reset navigation history
            if (newPage === HOME_PATH) {
                return [HOME_PATH];
            }

            // Only add newPage if it does not already exist in the history
            if (!prevHistory.includes(newPage)) {
                return [...prevHistory, newPage];
            }
            return prevHistory;
        });
    }, [location, setNavigationHistory]);


    const breadcrumb = navigationHistory.map((path, index) => {
        let name;
        if (path === HOME_PATH) {
            name = 'Home';
        } else if (path.includes('/event/')) {
            const pathSegments = path.split('/');
            name = decodeURIComponent(pathSegments[2]).replace(/-/g, ' ');
        } else {
            name = path.split('/')[1];
        }
        return (
            <span key={index}>
                {index > 0 && ' > '}
                <Link to={path} 
                onClick={() => {
                    // Update navigation history to keep only paths up to the clicked link
                    setNavigationHistory((prevHistory) => {
                        const newHistory = prevHistory.slice(0, index + 1);
                        return newHistory; // Keep only history up to the clicked breadcrumb
                    });
                }}
                style={{ color: 'inherit', textDecoration: 'underline' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
            </span>
        );
    });

    return (
        <>
            <Header navigationHistory={navigationHistory} />
            {/* Breadcrumb display below Header */}
            <div
            className="breadcrumb"
            style={{
                backgroundColor: '#333',
                color: 'white',
                padding: '10px',
                fontSize: '16px',
            }}
        >
            {breadcrumb.length > 0 ? breadcrumb : "Home"}
        </div>
            <Routes>
                <Route path={HOME_PATH} element={<Home />} />
                <Route path="/event/:eventName/:eventDate" element={<Event />} />
                <Route path="/cart/:eventName/:eventDate" element={<Cart />} />
                <Route path="/tickets/:eventName/:eventDate" element={<Tickets />} />
                <Route path="/confirmation" element={<PurchaseConfirmation />} />
                <Route path="/events/:category" element={<Home />} />
            </Routes>
            <Footer />
        </>
    );
}




export default App;

