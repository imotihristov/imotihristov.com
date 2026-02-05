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
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component that uses AuthContext
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500">Зареждане...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App Routes component (needs to be inside AuthProvider)
const AppRoutes = () => {
  return (
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
  );
};

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
