import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CheckoutForm from './components/StripePayment/CheckoutForm';
import PaymentSuccess from './components/StripePayment/PaymentSuccess';
import LoginForm from './components/Users/Login';
import Home from './components/Home/Home';
import Plans from './components/Plans/Plan';
import Register from './components/Users/Register';
import Dashboard from './components/Users/UserDashboard';
import PublicNavbar from './components/Navbar/PublicNavbar';
import AppFeatures from './components/AppFeatures/AppFeatures';
import AboutUs from './components/About/AboutUs';
import ContentGenerationHistory from './components/Users/ContentGenerationHistory';
import HistoryDetails from './components/Users/HistoryDetails';
import GenerateContent from './components/ContentGeneration/GenerateContent';
import FreePlanSignup from './components/StripePayment/FreePlanSignup';
import PrivateNavbar from './components/Navbar/PrivateNavbar';
import { useAuth } from './AuthContext/AuthContext';
import AuthRoute from './components/AuthRoute/AuthRoute';

const App = () => {
  //custom auth hook
  const { isAuthenticated } = useAuth();

  return (
    <>
      <BrowserRouter>
        {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}
        <Routes>
          <Route path='/features' element={<AppFeatures />} />
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/login' element={<LoginForm />} />

          <Route path='/plans' element={<Plans />} />

          <Route path='/register' element={<Register />} />
          <Route
            path='/checkout/:plan'
            element={
              <AuthRoute>
                <CheckoutForm />
              </AuthRoute>
            }
          />
          <Route
            path='/free-plan'
            element={
              <AuthRoute>
                <FreePlanSignup />
              </AuthRoute>
            }
          />
           <Route path='/success' element={<PaymentSuccess />} />

          <Route
            path='/dashboard'
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />

          <Route
            path='/history'
            element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            }
          />
          <Route
            path='/history/:id'
            element={
              <AuthRoute>
                <HistoryDetails />
              </AuthRoute>
            }
          />
          <Route
            path='/generate-content'
            element={
              <AuthRoute>
                <GenerateContent />
              </AuthRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
