import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Index from './Index';
import ErrorPage from './components/error/ErrorPage';
import { Toaster } from "react-hot-toast";
import Main from './Pages/Dahboard/Main';
import Signup from './Pages/Auth/Signup';
import Login from './Pages/Auth/Login';
import ProtecedRoute from "./components/route/ProtecedRoute";
import { UserProvider } from './context/UserContext';
import Preloader from './Preloader';


function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Thoda delay kar do sab load hone ke liye
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2 second baad loader hat jayega
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader/>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard/*" element={
          <ProtecedRoute>
            <Main />
          </ProtecedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}