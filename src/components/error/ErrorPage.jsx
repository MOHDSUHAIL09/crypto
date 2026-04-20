import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css"; 

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <button className="error-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
