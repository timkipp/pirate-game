// frontend/src/pages/NewGameSetup.js
import { useEffect } from "react";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";  // For navigation
import './NewGameSetup.css';

// Example NewGameSetup Component
function NewGameSetup({ userName, onLogout }) {
    const navigate = useNavigate();  // To navigate between screens

    const [items, setItems] = useState();
    const [rawItems, setRawItems] = useState();
    const [selectedItem, setSelectedItem] = useState(["No Item", "", 0, ""]);

    // const [captains, setCaptains] = useState(<option></option>);
    const [captains, setCaptains] = useState([]);
    const [rawCaptains, setRawCaptains] = useState();
    const [selectedCaptain, setSelectedCaptain] = useState();

    const [userData, setUserData] = useState();

    const getUserData = async (e) => {
        //e.preventDefault();
    
        const url = 'https://pirate-game-7tm0.onrender.com/api/users/:username?username=' + userName;
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
          
            console.log(data);
            setUserData(JSON.stringify(data));
            getItems(data);
            getCaptains(data);
        } catch (err) {

        }
    };

    const getItems = async (user) => {
        var rawItemList = new Array(user.itemInventory.length);
        for(var i = 0; i < user.itemInventory.length; i++){
            const url = `https://pirate-game-7tm0.onrender.com/api/items/:id?id=${user.itemInventory[i].itemId}`;
            const itemIndex = i;

        try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                //console.log(data.name);
                rawItemList[itemIndex] = data;
                //console.log(rawItemList);
            } catch (err) {}
        }

        setRawItems(await new Promise((resolve) => {
            if(!rawItemList.includes(null)){
                setItems(rawItemList.map((item, i) => {
                    if(user.itemInventory[i].itemQuantity !== 0){
                       return <option key={item.name}>{item.name} ({user.itemInventory[i].itemQuantity})</option>; 
                    }
                }));
                setSelectedItem(["No Item", "", 0, ""]);
                resolve(JSON.stringify(rawItemList));
            }
        }));
    };


    const itemSelect = (item) => {
        if(item.target.value !== "No Item"){
            
            try {
                const data = JSON.parse(rawItems);
                for(var i = 0; i < data.length; i++){
                    if(data[i].name === item.target.value.split(" (")[0]){
                        setSelectedItem([item.target.value, data[i].resourceAffected, data[i].resourceShift, data[i].itemID]);
                    }
                }
            } catch {}
        } else {
            setSelectedItem([item.target.value, "", 0, ""]);
        }
    };

    const getCaptains = async (user) => {
        try {
            const rawCaptainList = [];

            for(let i = 0; i < user.captains.length; i++){
                const url = `https://pirate-game-7tm0.onrender.com/api/captains/:id?id=${user.captains[i]}`;
                // const captainIndex = i;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                //console.log(data.name);
                rawCaptainList.push(data);
                //console.log(rawCaptainList);
            }

            setCaptains(rawCaptainList.map(captain => (
                <option key={captain.name} value={captain.name}>{captain.name}</option>
            )))

            if (rawCaptainList.length > 0) {
                setSelectedCaptain(JSON.stringify(rawCaptainList[0]));
            }
        } catch (err) {
            console.log("Error fetching captains:", err);
        }
    };

    const captainSelect = (captain) => {
        try {
            const data = JSON.parse(rawCaptains);
            
            for(var i = 0; i < data.length; i++){
                if(data[i].name === captain.target.value){
                    setSelectedCaptain(JSON.stringify(data[i]));
                }
            }
        } catch {}
    };

    useEffect(() => {
        getUserData();
    }, []);

    function ItemDropdown(){
        return(
            <div id="items">
                <label for="ItemDropdown">Select Item: </label>
                <select 
                    className="ItemDropdown" 
                    id="ItemDropdown" 
                    onChange={itemSelect}
                    value={selectedItem[0]}
                ><option>No Item</option>{items}</select>

                <p>+{selectedItem[2]} {selectedItem[1]}</p>
            </div>
        );
    }

    function CaptainDropdown(){
        if(selectedCaptain != null){
            var captainObject = JSON.parse(selectedCaptain)
            return(
                <div className="selection-and-stats">
                    <div className="resources">
                        <h3>Resources</h3>
                        <ul className="resource-stats">
                            <li>Gold: {captainObject.goldStart}</li>
                            <li>Provisions: {captainObject.provisionStart}</li>
                            <li>Morale: {captainObject.moraleStart}</li>
                            <li>Crew: {captainObject.crewStart}</li>
                        </ul>
                    </div>
                    <div id="captain">
                        <label for="CaptainDropdown">Select Captain: </label>
                        <select 
                            className="CaptainDropdown" 
                            id="CaptainDropdown"
                            onChange={captainSelect}
                            value={captainObject.name}
                        >{captains}</select>
                        <p>{captainObject.name}: {captainObject.description}</p>
                    </div>                    
                </div>
            );
        }
        return(
            <div>
                <label for="CaptainDropdown">Select Captain: </label>
                <select className="CaptainDropdown" 
                    id="CaptainDropdown"></select>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
            </div>
        );
    }

    async function setCaptainAndItemBoost() {
        const userName = JSON.parse(userData).userName;
        const captain = JSON.parse(selectedCaptain);
        const itemShift = { itemID: selectedItem[3], shiftName: selectedItem[1], shiftAmount: selectedItem[2] };

        console.log("Sending captain and item data to backend:", { userName, captain, itemShift });

        const response = await fetch('https://pirate-game-7tm0.onrender.com/api/users/initRun', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, captain, itemShift }),
        });

        if (!response.ok) {
            console.error("Error setting captain and item:", await response.text());
        } else {
            console.log("Captain and item set successfully.");
        }
    }

    // Handle Starting the Run
    const handleStartRun = async () => {
        try {
            console.log("Starting game...");
            await setCaptainAndItemBoost(); // Ensure captain is set before navigating
            navigate("/run"); // Redirect to the RunScreen page
        } catch (error) {
            console.error("Error starting game:", error);
        }
    };

    // Go back to the main menu.
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="new-game-setup">
            <button className = "back-button" onClick = {goBack}>Back</button>
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <h1 className="menu-title">New Game</h1>

            <div className="menu-buttons">
                <CaptainDropdown></CaptainDropdown>

                <ItemDropdown></ItemDropdown>

                {/* Button to start the run */}
                <button className="menu-button" onClick={handleStartRun}>Start Run</button>
            </div>
        </div>
    );
}

export default NewGameSetup;