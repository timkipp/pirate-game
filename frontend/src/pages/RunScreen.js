// frontend/src/pages/Runscreen.js
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Resources from '../components/Resources';
import { useNavigate } from "react-router-dom";  // For navigation
import './RunScreen.css';

function RunScreen({ onLogout }) {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [newHighscore, setNewHighScore] = useState(false);
    const [currencyGiven, setCurrencyGiven] = useState(false);
    const [resources, setResources] = useState({
    gold: 100,
    provisions: 100,
    morale: 100,
    crew: 10,
    });

    // Shuffle to randomize the order of cards
    const shuffleCards = (cards) => {
        const shuffled = [...cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Fetch cards and initialize game state on component mount
    useEffect(() => {
        const initializeGameState = async () => {
            try {
                const userID = JSON.parse(localStorage.getItem('user')).userName; // Get userID from localStorage
                const response = await fetch('https://cosc484-project-group-4.onrender.com/api/game-state/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userID }),
                });
                const data = await response.json();
                console.log('Initialized game state:', data.resources); // Log resources for debugging
                setResources(data.resources); // Set resources from backend
                setScore(data.score);
            } catch (error) {
                console.error('Error initializing game state:', error);
            }
        };

        const fetchCards = async () => {
            try {
                const response = await fetch('https://cosc484-project-group-4.onrender.com/api/cards');
                const data = await response.json();
                const shuffled = shuffleCards(data);
                setCards(shuffled);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        initializeGameState();
        fetchCards();
    }, []);

    // Handle user selecting a choice (A or B)
    const handleChoiceMade = async (choice) => {
        const card = cards[currentCardIndex];
        const selected = card.choices[choice];

        const chance = selected.good_result_chance;
        const roll = Math.random();

        const result = roll < chance ? selected.good_result : selected.bad_result;

        // Update resources locally
        const updatedResources = {
            gold: Math.max(0, Math.min(100, resources.gold + result.gold_effect)),
            provisions: Math.max(0, Math.min(100, resources.provisions + result.provisions_effect)),
            morale: Math.max(0, Math.min(100, resources.morale + result.morale_effect)),
            crew: Math.max(0, Math.min(100, resources.crew + result.crew_effect)),
        };
        setResources(updatedResources);

        // Update resources in the backend
        const userID = JSON.parse(localStorage.getItem('user')).userName; // Get userID from localStorage
        try {
            for (const [resource, value] of Object.entries(updatedResources)) {
                await fetch('https://cosc484-project-group-4.onrender.com/api/game-state/resource', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userID, resource, value }),
                });
            }
        } catch (error) {
            console.error('Error updating resources:', error);
        }

        // Update score locally
        const updatedScore = score + 1;
        //console.log(updatedScore);
        const url = 'https://cosc484-project-group-4.onrender.com/api/users/:username?username=' + JSON.parse(localStorage.getItem('user')).userName;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            //console.log(data);
            if(updatedScore > data.highScore){
                setNewHighScore(true);
            }
            
        } catch (err) {}
        setScore(updatedScore);

        // Update score in the backend
        try {
            await fetch('https://cosc484-project-group-4.onrender.com/api/game-state/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID, updatedScore }),
            });
        } catch (error) {
            console.error('Error updating resources:', error);
        }

        // Move to next card
        setCurrentCardIndex((prev) => prev + 1);
    };

    // Handle returning to main menu
    const returnToMenu = async () => {
        navigate("/menu");
    };

    const giveCurrency = async () => {
        try {
            const userName = JSON.parse(localStorage.getItem('user')).userName;
            const value = Math.floor(score/10);
            await fetch('https://cosc484-project-group-4.onrender.com/api/users/addcurrency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, value }),
            });
        } catch (error) {
            console.error('Error updating resources:', error);
        }
    };

    function HighScore() {
        if(Object.values(resources).some(value => value <= 0) && !currencyGiven){
            setCurrencyGiven(true);
            giveCurrency();
        }
        if(newHighscore){
            return(<h1>New High Score</h1>);
        } else {
            return(<p></p>);
        }
    }

    // Game over condition
    const isResourceDepleted = Object.values(resources).some(value => value <= 0);

    if (currentCardIndex >= cards.length || isResourceDepleted) {
        return (
            <div className="run-screen">
                <h2 className="game-over-title">
                    {isResourceDepleted ? 'Game Over – You ran out of a vital resource!' : 'Run Complete!'}
                </h2>
                <h2 className="score">Final Score: {score}</h2>
                <HighScore></HighScore>
                <Resources resources={resources} />
                <button className="menu-button" onClick={returnToMenu}>Return to Menu</button>
            </div>
        );
    }

    return (
        <div className="run-screen">
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <h2 className="score">Score: {score}</h2>
            <Resources resources={resources} />
            {cards.length > 0 && (
                <Card
                    title={cards[currentCardIndex].title}
                    description={cards[currentCardIndex].description}
                    choices={cards[currentCardIndex].choices}
                    onChoiceMade={handleChoiceMade}
                />
            )}
        </div>
    );
}

export default RunScreen;