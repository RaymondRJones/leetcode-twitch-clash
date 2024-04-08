import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import { useEffect } from 'react';
function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Correctly call useNavigate here

  const createRoom = async () => {
    const apiKey = 'OuhtOfHQSFavV1b1dacWL5rwSbE2d77s6DO57kMc';
    const ws = new WebSocket(`wss://rktndgn0fd.execute-api.us-east-1.amazonaws.com/Prod?x-api-key=${apiKey}`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      ws.send(JSON.stringify({
        action: 'createRoom',
        userName: userName,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.statusCode === 200) {
        console.log("Room created successfully:", data.body);

        const body = JSON.parse(data.body);
        setRoomCode(body.roomID);
        navigate('/room', { state: { roomCode: body.roomID } });
        ws.close();
      } else {
        console.error('Error creating room:', data.message || 'Unknown error');
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.log('WebSocket Error:', error);
      ws.close();
    };
  };


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
      <button onClick={joinRoom}>Join a Room</button> {/* Use joinRoom function on click */}

      <button onClick={createRoom}>Create A Room</button> {/* Use joinRoom function on click */}
    </div>
  );
}

export default Home;
