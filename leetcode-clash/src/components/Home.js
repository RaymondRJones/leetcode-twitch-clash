import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported

function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Correctly call useNavigate here

  const joinRoom = async () => {
    // Example purpose: Simulated response for success
    const data = { success: true, leaderboard: [] }; // Simulate successful API response

    if (data.success) {
      console.log("Welcome! " + userName);
      // Simulated leaderboard data
      const dummyLeaderboardData = [
        { id: 1, name: 'Alice', finishTime: '2m 15s' },
        { id: 2, name: 'Bob', finishTime: '3m 30s' },
        { id: 3, name: 'Charlie', finishTime: '5m 45s' },
      ];

      // Navigate to the leaderboard component with the dummy data
      navigate('/leaderboard', { state: { leaderboard: dummyLeaderboardData } });
    } else {
      // Handle failure (e.g., show an error message)
      console.error('Error joining room:', 'Failed to join the room');
    }
  };

  return (
    <div>
      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Room Code"
      />
      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <button onClick={joinRoom}>Enter</button> {/* Use joinRoom function on click */}
    </div>
  );
}

export default Home;
