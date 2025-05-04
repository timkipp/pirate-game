import React from "react";
import { useNavigate } from "react-router-dom";  // For navigation

// Example NewGameSetup Component
function NewGameSetup({ onLogout }) {
    const navigate = useNavigate();  // To navigate between screens
  
    // Handle Captain selection
    const handleSelectCaptain = () => {
        // Logic for selecting a captain (could open a modal, or redirect to another screen)
        console.log("Captain selected!");
        navigate("/captain-selection");  // Redirect to the Captain Selection page (create this page separately)
    };

    // Handle Item selection
    const handleSelectItems = () => {
        // Logic for selecting items (could open a modal or go to another page)
        console.log("Items selected!");
        navigate("/items-selection");  // Redirect to the Items Selection page (create this page separately)
    };

    // Handle Starting the Run
    const handleStartRun = () => {
        // Logic for starting the game run
        console.log("Game started!");
        navigate("/run");  // Redirect to the RunScreen page where the game will run
    };

    return (
        <div className="new-game-setup">
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <h1 class="menu-title">New Game</h1>

            <div className="menu-buttons">
                {/* Button to select a captain */}
                <button class="menu-button" onClick={handleSelectCaptain}>Select Captain</button>

                {/* Button to select items */}
                <button class="menu-button" onClick={handleSelectItems}>Select Items</button>

                {/* Button to start the run */}
                <button class="menu-button" onClick={handleStartRun}>Start Run</button>
            </div>
        </div>
    );
}

export default NewGameSetup;