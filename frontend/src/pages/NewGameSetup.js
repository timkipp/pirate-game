import { useEffect } from "react";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";  // For navigation

// Example NewGameSetup Component
function NewGameSetup({ userName, onLogout }) {
    const navigate = useNavigate();  // To navigate between screens

    const [items, setItems] = useState();
    const [rawItems, setRawItems] = useState();
    const [selectedItem, setSelectedItem] = useState(["No Item", "", 0]);

    const [captains, setCaptains] = useState(<option></option>);
    const [rawCaptains, setRawCaptains] = useState();
    const [selectedCaptain, setSelectedCaptain] = useState();

    const [userData, setUserData] = useState();

    const getUserData = async (e) => {
        //e.preventDefault();
    
        const url = 'http://localhost:5000/api/users/:username?username=' + userName;
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
          
            //console.log(data);
            setUserData(JSON.stringify(data));
            getItems(data);
            getCaptains(data);
        } catch (err) {

        }
    };

    const getItems = async (user) => {
        var rawItemList = new Array(user.itemInventory.length);
        for(var i = 0; i < user.itemInventory.length; i++){
            const url = `http://localhost:5000/api/items/:id?id=${user.itemInventory[i].itemId}`;
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
                setItems(rawItemList.map((item, i) => <option key={item.name}>{item.name} ({user.itemInventory[i].itemQuantity})</option>));
                setSelectedItem(["No Item", "", 0]);
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
                        setSelectedItem([item.target.value, data[i].resourceAffected, data[i].resourceShift]);
                    }
                }
            } catch {}
        } else {
            setSelectedItem([item.target.value, "", 0]);
        }
    };

    const getCaptains = async (user) => {
        var rawCaptainList = new Array(user.captains.length);
        for(var i = 0; i < user.captains.length; i++){
            const url = `http://localhost:5000/api/captains/:id?id=${user.captains[i]}`;
            const captainIndex = i;

        try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                //console.log(data.name);
                rawCaptainList[captainIndex] = data;
                //console.log(rawCaptainList);
            } catch (err) {}
        }

        setRawCaptains(await new Promise((resolve) => {
            if(!rawCaptainList.includes(null)){
                setCaptains(rawCaptainList.map(item => <option key={item.name}>{item.name}</option>));
                setSelectedCaptain(JSON.stringify(rawCaptainList[0]));
                resolve(JSON.stringify(rawCaptainList));
            }
        }));
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
            <div>
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
                <div>
                    <label for="CaptainDropdown">Select Captain: </label>
                    <select 
                        className="CaptainDropdown" 
                        id="CaptainDropdown"
                        onChange={captainSelect}
                        value={captainObject.name}
                    >{captains}</select>
                    <p>{captainObject.name}: {captainObject.description}</p>
                    <p>gold: {captainObject.goldStart}</p>
                    <p>provisions: {captainObject.provisionStart}</p>
                    <p>morale: {captainObject.moraleStart}</p>
                    <p>crew: {captainObject.crewStart}</p>
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

    function UserDisplay(){
        if(userData != null){
            console.log(JSON.parse(userData))
            return(
                <p>{JSON.parse(userData).userName}</p>
            );
        } else {
            return(
                <p>No User Data</p>
            );
        }
    }

    async function setCaptain () {
        const userID = JSON.parse(userData).userName;
        const captain = JSON.parse(selectedCaptain);
        console.log(JSON.stringify({ userID, captain }));
        const response = await fetch('http://localhost:5000/api/game-state/captain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID, captain }),
        });
    };

    // Handle Starting the Run
    const handleStartRun = () => {
        // Logic for starting the game run
        console.log("Game started!");
        setCaptain();
        navigate("/run");  // Redirect to the RunScreen page where the game will run
    };

    return (
        <div className="new-game-setup">
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <h1 className="menu-title">New Game</h1>

            <div className="menu-buttons">
                <CaptainDropdown></CaptainDropdown>

                <ItemDropdown></ItemDropdown>

                {/* Button to start the run */}
                <button className="menu-button" onClick={handleStartRun}>Start Run</button>

                <UserDisplay></UserDisplay>
            </div>
        </div>
    );
}

export default NewGameSetup;