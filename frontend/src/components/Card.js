import React from 'react';

const Card = ({ title, description, choices, onChoiceMade }) => {
  // Handle button clicks and call onChoiceMade
  const handleChoice = (choice) => {
    onChoiceMade(choice); // Notify the parent component with the choice
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>

      <div className="choices">
        <button onClick={() => handleChoice('A')}>{choices.A.action_taken}</button>
        <button onClick={() => handleChoice('B')}>{choices.B.action_taken}</button>
      </div>
    </div>
  );
};

export default Card;