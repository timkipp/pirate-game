import React from 'react';
import './MainMenu.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function MainMenu({ userName, onLogout }) {
    const navigate = useNavigate();  // Set up the navigate function

    // Event handler for New Game button
    const handleNewGame = () => {
        navigate("/setup");  // Navigate to the NewGameSetup page
    };

    return (
        <div className="main-menu">
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <h1 className="menu-title">Ahoy there, {userName}!</h1>
            <div className="menu-buttons">
                <button className="menu-button" onClick={handleNewGame}>New Game</button>
                <button className="menu-button">Marketplace</button>
                <button className="menu-button">Leaderboard</button>
            </div>
        </div>
    );
}

export default MainMenu;