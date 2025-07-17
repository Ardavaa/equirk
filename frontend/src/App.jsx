import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import OrbitAvatars from "./components/OrbitAvatars";
import AboutSection from './components/AboutSection';
import FeatureSection from './components/FeatureSection';
import ContactSection from './components/ContactSection';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CareerSection from './components/CareerSection';
import { AuthProvider } from './contexts/AuthContext';
import AuthStatus from './components/AuthStatus';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function MainLanding() {
  return (
    <>
      <AuthStatus />
      <Navbar />
      <div className='mt-8'>
        <HeroSection />
      </div>
      {/* <div className='my-28'>
        <OrbitAvatars />
      </div> */}
      <div className='mt-32'>
        <AboutSection />
      </div>
      <div className='mt-48'>
        <FeatureSection/>
      </div>
      <div className='mt-32'>
        <CareerSection/>
      </div>
      <div className='mt-48'>
        <ContactSection />
      </div>
      <div className='mt-24 mb-8'>
        <CTA/>
      </div>
      <Footer/>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='bg-white'>
          <Routes>
            <Route path="/" element={<MainLanding />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
