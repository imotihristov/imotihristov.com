import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import PropertyDetails from './pages/PropertyDetails';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { PropertyProvider } from './context/PropertyContext';

// Simple route protection component
// If not admin, redirect to Home ("/") instead of Login ("/login") 
// to prevent users from seeing the login screen upon reloading the app if they were on a protected route.
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <PropertyProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="properties" element={<SearchResults />} />
            <Route path="properties/:id" element={<PropertyDetails />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Routes without Header/Footer */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-property" 
            element={
              <ProtectedRoute>
                <AddProperty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-property/:id" 
            element={
              <ProtectedRoute>
                <EditProperty />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect legacy add-property route if accessed directly */}
          <Route path="/add-property" element={<Navigate to="/admin/add-property" replace />} />

          {/* Catch-all route: Redirect any unknown path to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </PropertyProvider>
  );
}

export default App;