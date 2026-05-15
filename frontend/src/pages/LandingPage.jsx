import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { guestLogin } from '../services/api';

import Navbar from '../components/Landing/Navbar';
import Hero from '../components/Landing/Hero';
import HowItWorks from '../components/Landing/HowItWorks';
import Features from '../components/Landing/Features';
import Testimonials from '../components/Landing/Testimonials';
import CallToAction from '../components/Landing/CallToAction';
import Footer from '../components/Landing/Footer';

const LandingPage = ({ onSignIn, onGetStarted }) => {
  const { login } = useAuth();
  const [guestLoading, setGuestLoading] = useState(false);

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const response = await guestLogin();
      login(response.data);
    } catch (err) {
      console.error('Guest login failed:', err);
      alert('Guest login failed. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} onGuestLogin={handleGuestLogin} guestLoading={guestLoading}/>
      <HowItWorks />
      <Features />
      <Testimonials />
      <CallToAction onGetStarted={onGetStarted} onSignIn={onSignIn}/>
      <Footer />
    </div>
  );
};

export default LandingPage;