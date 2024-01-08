import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    // Destroy the session token completely
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token');
    console.log(authToken);

    if (authToken) {
      navigate('/home');
    }

    if (!authToken) {
      navigate('/register');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
