import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import MainLayout from './layouts/MainLayout';
import FormFillUp from './screens/FormFillUp';
import SavedHistory from './screens/SavedHistory';
import Profile from './screens/Profile';
import ReceiptDetail from './screens/ReceiptDetail';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/otp" element={<Navigate to="/login" replace />} />

        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/form" />} />
          <Route path="form" element={<FormFillUp />} />
          <Route path="history" element={<SavedHistory />} />
          <Route path="history/:id" element={<ReceiptDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
