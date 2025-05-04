import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Resources from '../components/Resources';
import './RunScreen.css';

function RunScreen({ onLogout }) {
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
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

    // Fetch cards on component mount
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch('/api/cards');
                const data = await response.json();
                const shuffled = shuffleCards(data);
                setCards(shuffled);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

    fetchCards();
  }, []);

    // Handle user selecting a choice (A or B)
    const handleChoiceMade = (choice) => {
    const card = cards[currentCardIndex];
    const selected = card.choices[choice];

    // Convert string percentage to number (e.g., "70%" → 70)
    const chance = parseInt(selected.good_result_chance.replace('%', ''), 10);
    const roll = Math.random() * 100;

    const result = roll < chance ? selected.good_result : selected.bad_result;

    // Update resources
    setResources((prev) => ({
        gold: prev.gold + result.gold_effect,
        provisions: prev.provisions + result.provisions_effect,
        morale: prev.morale + result.morale_effect,
        crew: prev.crew + result.crew_effect,
    }));

    // Move to next card
    setCurrentCardIndex((prev) => prev + 1);
  };

  // Game over condition
  if (currentCardIndex >= cards.length) {
    return (
        <div className="run-screen">
        <h2 className="game-over-title">Run Complete!</h2>
        <Resources resources={resources} />
        </div>
    );
  }

    return (
    <div className="run-screen">
        <button className="logout-button" onClick={onLogout}>Logout</button>
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