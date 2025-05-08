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
    const itemsURL = `http://localhost:5000/api/items`;

    // URL for the captains within the database.
    const captainsURL = `http://localhost:5000/api/captains`;

    // The items to be displayed.
    const [items, setItems] = useState([]);
    
    // The captains to be displayed.
    const [captains, setCaptains] = useState([]);

    // Go back to the main menu.
    const goBack = () => {
        navigate(-1);
    };

    // Fetch the items and captains.
    useEffect(() => {
        const fetchStock = async() => {
            try {
                const itemData = await (await fetch(itemsURL)).json();
                const captainData = await (await fetch(captainsURL)).json();
                setItems(itemData);
                setCaptains(captainData);
            } catch (error) {
                console.error("ERROR FETCHING ITEMS & CAPTAINS: " + error);
            }
        };
        fetchStock();
    }, []);

    return (
        <div className = "marketplace">
            {/* Logout button */}
            <button className = "logout-button" onClick={onLogout}>Logout</button>
            {/* Title header */}
            <br />
            <h1 className = "menu-title">Welcome to the marketplace, {userName}!</h1>
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
                    <tbody>
                        {items.map((item) => (
                            <tr key = {item.itemID}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.description}</td>
                                <td>{item.resourceAffected}</td>
                                <td>{item.resourceShift}</td>
                                <td>
                                    <button className = "purchase-button">Purchase</button>
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
                    <tbody>
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
                                    <button className = "purchase-button">Purchase</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* The back button */}
            <button className = "back-button" onClick = {goBack}>Back</button>
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