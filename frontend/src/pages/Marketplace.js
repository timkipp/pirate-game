// React App
import { useEffect } from "react";
import React, {useState} from "react";

// Stylesheet
import './Marketplace.css';

// Navigation
import { useNavigate } from 'react-router-dom';

function Marketplace ({userName, onLogout}) {
    
    // Used to navigate to other pages.
    const navigate = useNavigate();

    // Go back to the main menu.
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className = "marketplace">
            {/* Logout button */}
            <button className = "logout-button" onClick={onLogout}>Logout</button>
            {/* Title header */}
            <h1 className = "menu-title">Welcome to the marketplace, {userName}!</h1>
            {/* The back button */}
            <button className = "back-button" onClick = {goBack}>Back</button>
        </div>
    );
}

export default Marketplace;