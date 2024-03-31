import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import { useEffect } from 'react';
function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Correctly call useNavigate here

  const createRoom = async () => {
    const ws = new WebSocket('wss://rktndgn0fd.execute-api.us-east-1.amazonaws.com/Prod'); // Update with your API Gateway WebSocket URL

    ws.onopen = () => {
      console.log('WebSocket Connected');
      ws.send(JSON.stringify({
        action: 'createRoom', // This should match the routing in your WebSocket API
        userName: userName, // Optional: if you want to track who created the room
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success && data.roomCode) {
        console.log("Room created successfully:", data.roomCode);
        setRoomCode(data.roomCode); // Update the room code state with the new room
        // Navigate to the new room, or display the room code to the user
        // navigate('/room', { state: { roomCode: data.roomCode } });
        ws.close(); // Close WebSocket connection after receiving the response
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
