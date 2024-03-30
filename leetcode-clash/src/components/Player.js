import React from 'react';

function Player({ name, finishTime }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Finish Time: {finishTime}</p>
    </div>
  );
}

export default Player;