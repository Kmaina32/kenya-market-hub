import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Home from './pages/Home';
import Services from './pages/Services';
import Chat from './pages/Chat';
import Forum from './pages/Forum';
import Admin from './pages/Admin';
import Rides from './pages/Rides';
import EnhancedRides from './pages/EnhancedRides';
import RideBooking from './pages/RideBooking';
import RideHistory from './pages/RideHistory';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverProfile from './pages/driver/DriverProfile';
import DriverRides from './pages/driver/DriverRides';
import DriverEarnings from './pages/driver/DriverEarnings';
import DriverHistory from './pages/driver/DriverHistory';
import DriverRoutes from './pages/driver/DriverRoutes';
import DriverAnalytics from './pages/driver/DriverAnalytics';
import DriverSettings from './pages/driver/DriverSettings';
import DriverRatings from './pages/driver/DriverRatings';
import ImprovedRides from './pages/ImprovedRides';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/services" element={<Services />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/improved-rides" element={<ImprovedRides />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/enhanced-rides" element={<EnhancedRides />} />
        <Route path="/ride-booking" element={<RideBooking />} />
        <Route path="/ride-history" element={<RideHistory />} />

        {/* Driver Routes */}
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/rides" element={<DriverRides />} />
        <Route path="/driver/earnings" element={<DriverEarnings />} />
        <Route path="/driver/history" element={<DriverHistory />} />
        <Route path="/driver/routes" element={<DriverRoutes />} />
        <Route path="/driver/analytics" element={<DriverAnalytics />} />
        <Route path="/driver/settings" element={<DriverSettings />} />
         <Route path="/driver/ratings" element={<DriverRatings />} />
      </Routes>
    </Router>
  );
}

export default App;
