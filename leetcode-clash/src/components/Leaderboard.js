import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import Player from './Player';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const location = useLocation(); // Use the useLocation hook to access route state

  useEffect(() => {
    // Check if there is any state passed through navigation
    if (location.state?.leaderboard) {
      // Set the players with the dummy leaderboard data passed from Home component
      setPlayers(location.state.leaderboard);
      // Set the current question to "Two Sum"
      setCurrentQuestion("Two Sum");
    }
  }, [location.state]);

  return (
    <div>
      <h2>Current Question: {currentQuestion}</h2>

      <h2>Leaderboard</h2>
      {players.sort((a, b) => {
        // Assuming finishTime is a string like '2m 15s', convert to total seconds for comparison
        const timeA = a.finishTime.split(' ');
        const timeB = b.finishTime.split(' ');
        return (parseInt(timeA[0]) * 60 + parseInt(timeA[1])) - (parseInt(timeB[0]) * 60 + parseInt(timeB[1]));
      }).map((player) => (
        <Player key={player.id} name={player.name} finishTime={player.finishTime} />
      ))}
    </div>
  );
}

export default Leaderboard;
