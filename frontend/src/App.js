import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'leaflet/dist/leaflet.css';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SupplyChainMap from './pages/SupplyChainMap';
import Inventory from './pages/Inventory';
import ShipmentTracker from './pages/ShipmentTracker';
import Nodes from './pages/Nodes';
import NodeDetails from './pages/NodeDetails';
import Connections from './pages/Connections';
import Products from './pages/Products';
import ShipmentDetails from './pages/ShipmentDetails';
import ShipmentForm from './pages/ShipmentForm';
import ProductDetails from './pages/ProductDetails';
import AdminRoute from './components/AdminRoute';
// Authentication services and context
import AuthService from './services/auth.service';
import { AuthContext } from './context/AuthContext';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <div className="app-container">
          {currentUser ? (
            <>
              <Header toggleSidebar={toggleSidebar} logOut={logOut} />
              <div className="content-container">
                <Sidebar isOpen={sidebarOpen} />
                <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/map" element={<SupplyChainMap />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/shipments" element={<ShipmentTracker />} />
                    <Route path="/nodes" element={<AdminRoute><Nodes /></AdminRoute>} />
                    <Route path="/nodes/:id" element={<NodeDetails />} />
                    <Route path="/connections" element={<AdminRoute><Connections /></AdminRoute>} />
                    <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
                    <Route path="/shipments/:id" element={<ShipmentDetails />} />
                    <Route path="/shipments/new" element={<ShipmentForm />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
