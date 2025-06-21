// frontend/src/components/Card.js
import React from 'react';

// Preload all .png and .jpg images in the cards folder
const cardImages = require.context('../assets/images/cards', false, /\.(png|jpe?g)$/);

// Helper to get image based on card title
const getCardImage = (title) => {
  const baseName = title.replace(/\s+/g, '_');
  try {
    return cardImages(`./${baseName}.png`);
  } catch {
    try {
      return cardImages(`./${baseName}.jpg`);
    } catch {
      console.warn(`Image not found for card: ${title}`);
      return null;
    }
  }
};

const Card = ({ title, description, choices, onChoiceMade }) => {
  const handleChoice = (choice) => {
    onChoiceMade(choice);
  };

  const imageSrc = getCardImage(title);

  return (
    <div className="card">
      <h2>{title}</h2>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="card-image feathered-image"
          style={{ objectFit: 'cover', marginBottom: '1rem' }}
        />
      )}
      <p>{description}</p>
      <div className="choices">
        <button onClick={() => handleChoice('A')}>{choices.A.action_taken}</button>
        <button onClick={() => handleChoice('B')}>{choices.B.action_taken}</button>
      </div>
    </div>
  );
};

export default Card;