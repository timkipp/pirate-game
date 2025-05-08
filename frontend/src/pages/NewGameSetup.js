import { useEffect } from "react";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";  // For navigation

// Example NewGameSetup Component
function NewGameSetup({ userName, onLogout }) {
    const navigate = useNavigate();  // To navigate between screens
    const [items, setItems] = useState(<option></option>);
    const [rawItems, setRawItems] = useState();
    const [selectedItem, setSelectedItem] = useState(["No Item", "", 0]);
    const [captains, setCaptains] = useState(<option></option>);
    const [rawCaptains, setRawCaptains] = useState();
    const [selectedCaptain, setSelectedCaptain] = useState(["", "", 5, 5, 5, 5]);
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
          
          //console.log(data[0].name);
          setUserData(JSON.stringify(data));
        } catch (err) {

        }
    };

    const getItems = async (e) => {
        //e.preventDefault();
    
        const url = `http://localhost:5000/api/items`;
    
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          const data = await response.json();
          
          //console.log(data[0].name);
          setItems(data.map(item => <option key={item.itemID}>{item.name}</option>));
          setRawItems(JSON.stringify(data));
        } catch (err) {

        }
    };


    const itemSelect = (item) => {
        console.log(item.target.value);
        if(item.target.value != "No Item"){
            try {
                const data = JSON.parse(rawItems);
            
                for(var i = 0; i < data.length; i++){
                    if(data[i].name === item.target.value){
                        setSelectedItem([item.target.value, data[i].resourceAffected, data[i].resourceShift]);
                    }
                }
            } catch {}
        } else {
            setSelectedItem([item.target.value, "", 0]);
        }
    };

    const getCaptains = async (e) => {
        //e.preventDefault();
    
        const url = `http://localhost:5000/api/captains`;
    
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          const data = await response.json();
          
          //console.log(data[0].name);
          setCaptains(data.map(captain => <option key={captain.captainID}>{captain.name}</option>));
          setRawCaptains(JSON.stringify(data));
          setSelectedCaptain([data[0].name, data[0].description, data[0].goldStart, data[0].provisionStart, data[0].moralStart, data[0].crewStart]);
        } catch (err) {

        }
    };

    const captainSelect = (captain) => {
        try {
            const data = JSON.parse(rawCaptains);
        
            for(var i = 0; i < data.length; i++){
                if(data[i].name === captain.target.value){
                    setSelectedItem([captain.target.value, data[i].description, data[i].goldStart, data[i].provisionStart, data[i].moralStart, data[i].crewStart]);
                }
            }
        } catch {}
    };

    useEffect(() => {
        getUserData();
        getItems();
        getCaptains();
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
                    defaultValue="No Item"
                ><option>No Item</option>{items}</select>

                <p>+{selectedItem[2]} {selectedItem[1]}</p>
            </div>
        );
    }

    function CaptainDropdown(){
        return(
            <div>
                <label for="CaptainDropdown">Select Captain: </label>
                <select 
                    className="CaptainDropdown" 
                    id="CaptainDropdown"
                    onChange={captainSelect}
                    value={selectedCaptain[0]}
                >{captains}</select>
                <p>{selectedCaptain[0]}: {selectedCaptain[1]}</p>
                <p>gold: {selectedCaptain[2]}</p>
                <p>provisions: {selectedCaptain[3]}</p>
                <p>morale: {selectedCaptain[4]}</p>
                <p>crew: {selectedCaptain[5]}</p>
            </div>
        );
    }

    function UserDisplay(){
        if(userData != null){
            return(
                <p>{JSON.parse(userData).userName}</p>
            );
        } else {
            return(
                <p>No User Data</p>
            );
        }
    }

    // Handle Starting the Run
    const handleStartRun = () => {
        // Logic for starting the game run
        console.log("Game started!");
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