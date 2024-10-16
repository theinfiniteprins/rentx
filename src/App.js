import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import Login from './components/Login';
import Register from './components/Register';
import UploadProperty from './components/UploadProperty';
import ShowProperty from './components/ShowProperty';
import Profile from './components/Profile';
import FavouriteProperties from './components/FavouriteProperty';
import MyProperties from './components/MyProperties';
import EditProperty from './components/EditProperty';
import ProtectedRoute from './components/ProtectedRoute'; // Import the HOC
import axios from 'axios';
import config from './configs/config'; // Ensure you have this for base URL
import './styles.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Fetch current user
    axios.get(`${config.baseUrl}/auth/currentuser`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((response) => {
      if (response.status === 200 && response.data) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // Not authenticated
      }
    })
    .catch((error) => {
      console.error('Error fetching current user:', error);
      setIsAuthenticated(false); // Handle error
    })
    .finally(() => {
      setIsLoading(false); // Set loading to false after the check is complete
    });
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/upload-property" element={<ProtectedRoute element={<UploadProperty />} isAuthenticated={isAuthenticated} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} isAuthenticated={isAuthenticated} />} />
        <Route path="/favourites" element={<ProtectedRoute element={<FavouriteProperties />} isAuthenticated={isAuthenticated} />} />
        <Route path="/myproperties" element={<ProtectedRoute element={<MyProperties />} isAuthenticated={isAuthenticated} />} />
        <Route path="/edit/:id" element={<ProtectedRoute element={<EditProperty />} isAuthenticated={isAuthenticated} />} />
        
        <Route path="/property/:id" element={<ShowProperty />} />
      </Routes>
    </Router>
  );
};

export default App;
