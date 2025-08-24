import { useState, useEffect } from 'react'
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
import { JobRecommendationsProvider } from './contexts/JobRecommendationsContext';
import { SavedDataProvider } from './contexts/SavedDataContext';
import AuthStatus from './components/AuthStatus';
import CareerInsights from './components/CareerInsights';
import JobRecommendations from './pages/JobRecommendations';
import MatchesRoadmaps from './pages/MatchesRoadmaps';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

function MainLanding() {
  const location = useLocation();
  const redirectedFrom = location.state?.from;
  const [showNotification, setShowNotification] = useState(!!redirectedFrom);

  useEffect(() => {
    if (redirectedFrom) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [redirectedFrom]);

  return (
    <>
    <div className='w-full h-full overflow-x-hidden'>
            <AuthStatus />
      <Navbar />
      
      {/* Show notification if redirected from protected route */}
      {showNotification && redirectedFrom && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-lg max-w-md w-full mx-4 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">
                Please log in to access {redirectedFrom}
              </p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Add padding-top to account for fixed navbar */}
      <div id="hero" className='xl:pt-24'>
        <HeroSection />
      </div>
      {/* <div className='my-28'>
        <OrbitAvatars />
      </div> */}
      <div id="about" className='mt-12 '>
        <AboutSection />
      </div>
      <div id="features" className='mt-48'>
        <FeatureSection/>
      </div>
      <div id="career" className='mt-32'>
        <CareerSection/>
      </div>
      <div id="contact" className='mt-48'>
        <ContactSection />
      </div>
      <div className='mt-24 mb-8'>
        <CTA/>
      </div>
      <Footer/>
    </div>
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  
  return (
    <div className='bg-white'>
      <Routes key={location.pathname}>
        <Route path="/" element={<MainLanding />} />
        <Route path="/career-insights" element={
          <ProtectedRoute>
            <CareerInsights />
          </ProtectedRoute>
        } />
        <Route path="/job-recommendations" element={
          <ProtectedRoute>
            <JobRecommendations />
          </ProtectedRoute>
        } />
        <Route path="/matches-roadmaps" element={
          <ProtectedRoute>
            <MatchesRoadmaps />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div className='w-full h-full overflow-x-hidden'>
      <AuthProvider>
      <JobRecommendationsProvider>
      <SavedDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SavedDataProvider>
      </JobRecommendationsProvider>
    </AuthProvider>
    </div>
  )
}

export default App
