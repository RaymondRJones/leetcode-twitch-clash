import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import { useEffect } from 'react';
function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Correctly call useNavigate here

  const wsRef = React.useRef(null);

  useEffect(() => {
    const apiKey = 'OuhtOfHQSFavV1b1dacWL5rwSbE2d77s6DO57kMc';  // Basic key
    const ws = new WebSocket(`wss://rktndgn0fd.execute-api.us-east-1.amazonaws.com/Prod?x-api-key=${apiKey}`);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'updateLeaderboard' && data.roomCode === roomCode) {
        // Handle the incoming leaderboard update
        console.log("Leaderboard update received", data.leaderboard);
        navigate('/leaderboard', { state: { leaderboard: data.leaderboard } });
      }
    };
  
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [navigate, roomCode]);


  const createRoom = async () => {
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


  const joinRoom = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        action: 'joinRoom',
        roomCode: roomCode,
        userName: userName,
      }));
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
