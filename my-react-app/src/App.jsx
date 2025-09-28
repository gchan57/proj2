import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Login from './components/Login';
import ClientDashboard from './components/ClientDashboard';
import FreelancerDashboard from './components/FreelancerDashboard';
import GigDetail from './components/GigDetail';
import Toast from './components/Toast';

function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <Router> {/* <-- This is the crucial fix */}
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login showToast={showToast} />} />
              <Route path="/client/dashboard" element={<ClientDashboard showToast={showToast} />} />
              <Route path="/freelancer/dashboard" element={<FreelancerDashboard showToast={showToast} />} />
              <Route path="/gig/:id" element={<GigDetail showToast={showToast} />} />
            </Routes>
          </main>
          {toast.show && <Toast message={toast.message} type={toast.type} />}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;