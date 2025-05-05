import React from 'react';

function Resources({ resources }) {
  return (
    <div className="resources">
      <h3>Resources</h3>
      <ul>
        <li><strong>Gold:</strong> {resources.gold}</li>
        <li><strong>Provisions:</strong> {resources.provisions}</li>
        <li><strong>Morale:</strong> {resources.morale}</li>
        <li><strong>Crew:</strong> {resources.crew}</li>
      </ul>
    </div>
  );
}

export default Resources;