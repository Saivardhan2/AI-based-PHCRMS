import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FarmerRegistration from './pages/FarmerRegistration';
import BuyerRegistration from './pages/BuyerRegistration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ResidueEstimation from './pages/ResidueEstimation';
import EnvironmentalImpact from './pages/EnvironmentalImpact';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/farmer-register" element={<FarmerRegistration />} />
                <Route path="/buyer-register" element={<BuyerRegistration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/residue-estimation" element={<ResidueEstimation />} />
                <Route path="/environmental-impact" element={<EnvironmentalImpact />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
