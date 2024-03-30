import React, { useEffect, useState } from 'react';
import Player from './Player';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setUserName] = useState('');
  useEffect(() => {
    // Fetch the leaderboard data from your server
    // This is a placeholder, replace it with your actual fetch request
    /*
    fetch('https://your-server.com/leaderboard')
      .then((response) => response.json())
      .then((data) => setPlayers(data.players));
      */

  }, []);

  return (
    <div>
      <h2>currentQuestion: {currentQuestion} </h2>

      <h2>Leaderboard</h2>
      {players.sort((a, b) => a.finishTime - b.finishTime).map((player) => (
        <Player key={player.id} name={player.name} finishTime={player.finishTime} />
      ))}
    </div>
  );
}

export default Leaderboard;
