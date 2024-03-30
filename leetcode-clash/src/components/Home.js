import React, { useState } from 'react';

function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');

  const joinRoom = async () => {
    try {
      const response = await fetch('https://your-server.com/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_id: roomCode, user_name: userName }),
      });
      const data = await response.json();

      if (data.success) {
        // Assuming data contains the leaderboard info
        // You could pass this data through state, context, or another state management solution
        navigate('/leaderboard', { state: { players: data.leaderboard } });
      } else {
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error joining room:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const test_join_room = () => {
    console.log("Welcome! " + userName);
    // Simulated leaderboard data
    const dummyLeaderboardData = [
      { id: 1, name: 'Alice', finishTime: '2m 15s' },
      { id: 2, name: 'Bob', finishTime: '3m 30s' },
      { id: 3, name: 'Charlie', finishTime: '5m 45s' },
    ];

    // Navigate to the leaderboard component with the dummy data
    navigate('/leaderboard', { state: { leaderboard: dummyLeaderboardData } });
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
      <button onClick={joinRoom}>Enter</button>
    </div>
  );
}

export default Home;
