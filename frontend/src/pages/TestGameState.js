import React, { useState } from 'react';

function TestGameState() {
    const [userID, setUserID] = useState('');
    const [resources, setResources] = useState({});
    const [lost, setLost] = useState(false);
    const [resource, setResource] = useState('');
    const [value, setValue] = useState(0);
    const [boost, setBoost] = useState({ gold: 0, provisions: 0, morale: 0, crewSize: 0 });

    const initializeGameState = async () => {
        const response = await fetch('http://localhost:5000/api/game-state/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID }),
        });
        const data = await response.json();
        setResources(data.resources);
    };

    const updateResource = async () => {
        const response = await fetch('http://localhost:5000/api/game-state/resource', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID, resource, value }),
        });
        const data = await response.json();
        setResources(data.resources);
    };

    const applyBoost = async () => {
        const response = await fetch('http://localhost:5000/api/game-state/boost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID, boost }),
        });
        const data = await response.json();
        setResources(data.resources);
    };

    const checkIfLost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/game-state/lost?userID=${userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game state');
            }
            const data = await response.json();
            setLost(data.lost);
        } catch (error) {
            console.error('Error checking if game is lost:', error);
        }
    };

    return (
        <div>
            <h1>Test GameState</h1>
            <input
                type="text"
                placeholder="Enter User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
            />
            <button onClick={initializeGameState}>Initialize Game State</button>
            <div>
                <h2>Resources</h2>
                <pre>{JSON.stringify(resources, null, 2)}</pre>
                <h3>{lost ? 'Game Over!' : 'Game is Running'}</h3>
            </div>
            <div>
                <h2>Update Resource</h2>
                <input
                    type="text"
                    placeholder="Resource (e.g., gold)"
                    value={resource}
                    onChange={(e) => setResource(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Value"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value))}
                />
                <button onClick={updateResource}>Set Resource</button>
            </div>
            <div>
                <h2>Apply Boost</h2>
                <div>
                    <label>Gold Boost:</label>
                    <input
                        type="number"
                        value={boost.gold}
                        onChange={(e) => setBoost({ ...boost, gold: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div>
                    <label>Provisions Boost:</label>
                    <input
                        type="number"
                        value={boost.provisions}
                        onChange={(e) => setBoost({ ...boost, provisions: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div>
                    <label>Morale Boost:</label>
                    <input
                        type="number"
                        value={boost.morale}
                        onChange={(e) => setBoost({ ...boost, morale: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div>
                    <label>Crew Size Boost:</label>
                    <input
                        type="number"
                        value={boost.crewSize}
                        onChange={(e) => setBoost({ ...boost, crewSize: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <button onClick={applyBoost}>Apply Boost</button>
            </div>
            <button onClick={checkIfLost}>Check If Game is Lost</button>
        </div>
    );
}

export default TestGameState;