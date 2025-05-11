import React from 'react';
import './MainMenu.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function MainMenu({ userName, onLogout }) {
    const navigate = useNavigate();  // Set up the navigate function

    // Event handler for New Game button
    const handleNewGame = () => {
        navigate("/setup");  // Navigate to the NewGameSetup page
    };

    // Event handler for Marketplace button
    const goToMarketplace = () => {
        navigate("/marketplace"); // Navigate to the Marketplace page
    };

    // Event handler for Leaderboard button
    const goToLeaderboard = () => {
        navigate("/leaderboard"); // Navigate to the Leaderboard page
    };

    return (
        <div className="main-menu">
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <h1 className="menu-title">Ahoy there, {userName}!</h1>
            <div className="menu-buttons">
                <button className="menu-button" onClick={handleNewGame}>New Game</button>
                <button className="menu-button" onClick={goToMarketplace}>Marketplace</button>
                <button className="menu-button" onClick={goToLeaderboard}>Leaderboard</button>
            </div>
        </div>
    );
}

export default MainMenu;