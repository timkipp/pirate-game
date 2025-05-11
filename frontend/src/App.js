import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import MainMenu from "./pages/MainMenu";
import NewGameSetup from "./pages/NewGameSetup";
import RunScreen from "./pages/RunScreen";
import Marketplace from "./pages/Marketplace";
import TestGameState from './pages/TestGameState';
import Leaderboard from "./pages/Leaderboard";

function App() {
  // Initialize userName from localStorage to persist login
  const [userName, setUserName] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser).userName : "";
  });

  // Handle successful login or signup
  const handleAuthSuccess = (userData) => {
    console.log('User Data Stored:', userData);
    setUserName(userData.userName);
    localStorage.setItem("user", JSON.stringify(userData)); // Store full user data
  };

  // Handle logout
  const handleLogout = () => {
    setUserName("");  // Clear the user state
    localStorage.removeItem("user");  // Remove user data from localStorage
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to the MainMenu if logged in, else show LoginScreen */}
        <Route
          path="/"
          element={
            userName ? (
              <Navigate to="/menu" />
            ) : (
              <LoginScreen onAuthSuccess={handleAuthSuccess} />
            )
          }
        />

        {/* Show MainMenu only if the user is logged in */}
        <Route
          path="/menu"
          element={
            userName ? (
              <MainMenu userName={userName} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Other protected routes */}
        <Route
          path="/setup"
          element={userName ? <NewGameSetup userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/run"
          element={userName ? <RunScreen onLogout={handleLogout} /> : <Navigate to="/" />}
        />

        {/* Marketplace */}
        <Route
          path="/marketplace"
          element={userName ? <Marketplace userName = {userName} onLogout = {handleLogout} /> : <Navigate to="/" />}
        />

        {/* TestGameState */}
        <Route
          path="/test-game-state"
          element={<TestGameState />}
        />
        {/* Leaderboard */}
        <Route
          path="/leaderboard"
          element={userName ? <Leaderboard userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;