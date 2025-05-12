// React App
import React, {useState, useEffect} from "react";

// Stylesheet
import './Marketplace.css';

// Navigation
import { useNavigate } from 'react-router-dom';

function Marketplace ({userName, onLogout}) {
    
    // Used to navigate to other pages.
    const navigate = useNavigate();

    // URL for the items within the database.
    const itemsURL = `https://cosc484-project-group-4.onrender.com/api/items`;

    // URL for the captains within the database.
    const captainsURL = `https://cosc484-project-group-4.onrender.com/api/captains`;

    // URL for the user data.
    const userURL = `https://cosc484-project-group-4.onrender.com/api/users/:username?username=${userName}`;

    // The items to be displayed.
    const [items, setItems] = useState([]);
    
    // The captains to be displayed.
    const [captains, setCaptains] = useState([]);

     // The user data to be displayed and updated.
    const [user, setUser] = useState([]);

    const [currency, setCurrency] = useState(0);

    // Go back to the main menu.
    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        // Fetch the items and captains.
        const fetchData = async() => {
            try {
                const itemData = await (await fetch(itemsURL)).json();
                const captainData = await (await fetch(captainsURL)).json();
                const userData = await (await fetch(userURL)).json();
                setItems(itemData);
                setCaptains(captainData);
                setUser(userData);
                setCurrency(userData.marketCurrency);
            } catch (error) {
                console.error("ERROR FETCHING DATA: " + error);
            }
        };
        fetchData();
    }, []);

    // Function to handle the purchase of an item.
    // Called when the purchase button is clicked.
    const handleItemPurchase = async(itemID) => {
        // Find the item with the matching ID.
        const item = items.find(item => item.itemID === itemID);
        console.log("Attempting to purchase " + item.name);
        // Check if the user has enough currency.
        if(item.price > user.marketCurrency) {
            console.error("ERROR: Not enough currency.");
            return;
        // Check if the user already owns the item.
        } else if(user.itemInventory.includes(itemID)) {
            console.error("ERROR: Item already purchased.");
            return;
        } else {
            // Add the item to the user's inventory.
            updateItems(item);
            // Subtract the price from the user's currency.
            updateCurrency(0 - item.price);
            setCurrency(currency - item.price);
            console.log("Successfully purchased " + item.name);
        }
    }

    // Function to handle the purchase of a captain.
    // Called when the purchase button is clicked.
    const handleCaptainPurchase = async(captainID) => {
        // Find the item with the matching ID.
        const captain = captains.find(captain => captain.captainID === captainID);
        console.log("Attempting to purchase " + captain.name);
        // Check if the user has enough currency.
        if(captain.price > user.marketCurrency) {
            console.error("ERROR: Not enough currency.");
            return;
        // Check if the user already owns the item.
        } else if(user.captains.includes(captainID)) {
            console.error("ERROR: Captain already purchased.");
            return;
        } else {
            // Add the captain to the user's inventory.
            updateCaptains(captain);
            // Subtract the price from the user's currency.
            updateCurrency(0 - captain.price);
            setCurrency(currency - captain.price);
            var captainList = user.captains;
            captainList.push(captain.captainID);
            var newUserData = user;
            newUserData.captains = captainList;
            setUser(newUserData);
            console.log("Successfully purchased " + captain.name);
        }
    }

    // Function to update the user's currency.
    const updateCurrency = async(value) => {
        try {
            const userName = JSON.parse(localStorage.getItem('user')).userName;
            await fetch('https://cosc484-project-group-4.onrender.com/api/users/addcurrency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, value }),
            });
        } catch (error) {
            console.error('ERROR: Could not update currency.');
        }
    }

    // Function to update the user's item inventory.
    const updateItems = async(rawItem) => {
        try {
            const item = { itemId: rawItem.itemID, itemQuantity: 1 };
            const userName = JSON.parse(localStorage.getItem('user')).userName;
            await fetch('https://cosc484-project-group-4.onrender.com/api/users/additem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, item }),
            });
        } catch (error) {
            console.error("ERROR: Could not add item.");
        }
    }

    // Function to update the user's captain inventory.
    const updateCaptains = async(captain) => {
        try {
            const userName = JSON.parse(localStorage.getItem('user')).userName;
            await fetch('https://cosc484-project-group-4.onrender.com/api/users/addcaptain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, captain }),
            });
        } catch (error) {
            console.error("ERROR: Could not add captain.");
        }
    }

    const test = () => {
        updateCurrency(50);
        console.log("test");
    }

    return (
        <div className = "marketplace">
            {/* The back button */}
            <button className = "back-button" onClick = {goBack}>Back</button>
            {/* Logout button */}
            <button className = "logout-button" onClick={onLogout}>Logout</button>
            {/* Title header */}
            <br />
            <h1 className = "menu-title">Welcome to the marketplace, {userName}!</h1>
            {/* The user's currency */}
            <h2 className = "currency-title">Your currency: {currency}</h2>
            {/* Item table */}
            <hr />
            <div className = "marketplace-tables">
                <table>
                    <thead>
                        <tr className = "header-row"> {/* First row - attribute labelers */}
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Resource Affected</th>
                            <th>Resource Shift</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> {/* For each item, create a row and fill the data. */}
                        {items.map((item) => (
                            <tr key = {item.itemID}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.description}</td>
                                <td>{item.resourceAffected}</td>
                                <td>{item.resourceShift}</td>
                                <td>
                                    <button className="purchase-button" onClick={() => handleItemPurchase(item.itemID)}>Purchase</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr />
                {/* Captain table */}
                <table>
                    <thead>
                        <tr className = "header-row"> {/* First row - attribute labelers */}
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Modifier</th>
                            <th>Gold Start</th>
                            <th>Provision Start</th>
                            <th>Morale Start</th>
                            <th>Crew Start</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> {/* For each captain, create a row and fill the data. */}
                        {captains.map((captain) => (
                            <tr key = {captain.captainID}>
                                <td>{captain.name}</td>
                                <td>{captain.price}</td>
                                <td>{captain.description}</td>
                                <td>{captain.modifier}</td>
                                <td>{captain.goldStart}</td>
                                <td>{captain.provisionStart}</td>
                                <td>{captain.moraleStart}</td>
                                <td>{captain.crewStart}</td>
                                <td>
                                    {user.captains.includes(captain.captainID) ? (
                                        <span>OWNED</span>
                                    ) : (
                                        <button className="purchase-button" onClick={() => handleCaptainPurchase(captain.captainID)}>Purchase</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Marketplace;

/*
---------- KEYS ----------
>>> Items
"itemID"
"price"
"name"
"description"
"resourceAffected"
"resourceShift"

>>> Captains (via captainsCollection.json)
"captainID"
"name"
"description"
"modifier"
"price"
"goldStart"
"provisionStart"
"moraleStart"
"crewStart"
*/