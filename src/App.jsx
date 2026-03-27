import { Route, Routes } from 'react-router-dom';
import Index from './Index';
import ErrorPage from './components/error/ErrorPage';
import { Toaster } from "react-hot-toast";
import Main from './Pages/Dahboard/Main';
import Signup from './Pages/Auth/Signup';
import Login from './Pages/Auth/Login';
import ProtecedRoute from "./components/route/ProtecedRoute";

// 1. Context Provider ko import karo (Path check kar lena jahan file banayi hai)
import { UserProvider } from './context/UserContext'; 

function AppContent() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Index />} />
        {/* Protected Dashboard Route */}
        <Route path="/dashboard/*" element={
          <ProtecedRoute>
            <Main />
          </ProtecedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/error" element={<ErrorPage />} /> */}
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










