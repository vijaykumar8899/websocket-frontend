import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ws, setWs] = useState(null);
  const [wsId, setWsId] = useState('');
  const [wsMessage, setWsMessage] = useState('');
  const [apiId, setApiId] = useState('');
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('https://websockets-tjie.onrender.com');

    socket.onopen = () => {
      console.log('Connected to server');
      displayResponse('Connected to server');
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('Received from server:', response);
      displayResponse('Received from server: ' + JSON.stringify(response));
    };

    socket.onclose = () => {
      console.log('Disconnected from server');
      displayResponse('Disconnected from server');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      displayResponse('WebSocket error: ' + error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const displayResponse = (message) => {
    setResponses((prev) => [...prev, message]);
  };

  const sendWebSocketMessage = () => {
    if (ws && wsId && wsMessage) {
      const message = { id: parseInt(wsId), text: wsMessage };
      ws.send(JSON.stringify(message));
      console.log('Sent to server:', message);
      displayResponse('Sent to server: ' + JSON.stringify(message));
    } else {
      alert('Please enter both ID and message');
    }
  };

  const fetchData = () => {
    if (apiId) {
      fetch(`https://websockets-tjie.onrender.com/api/get_websocket_data/${apiId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Received from API:', data);
          displayResponse('Received from API: ' + JSON.stringify(data));
        })
        .catch(error => {
          console.error('API error:', error);
          displayResponse('API error: ' + error);
        });
    } else {
      alert('Please enter an ID');
    }
  };

  return (
    <div className="App">
      <h1>WebSocket and API Test</h1>

      <div>
        <h2>Send WebSocket Message</h2>
        <label>ID:</label>
        <input type="number" value={wsId} onChange={(e) => setWsId(e.target.value)} placeholder="Enter ID" />
        <label>Message:</label>
        <input type="text" value={wsMessage} onChange={(e) => setWsMessage(e.target.value)} placeholder="Enter message" />
        <button onClick={sendWebSocketMessage}>Send Message</button>
      </div>

      <div>
        <h2>Fetch Data from API</h2>
        <label>ID:</label>
        <input type="number" value={apiId} onChange={(e) => setApiId(e.target.value)} placeholder="Enter ID" />
        <button onClick={fetchData}>Fetch Data</button>
      </div>

      <div>
        <h2>Server Responses</h2>
        <pre>{responses.join('\n')}</pre>
      </div>
    </div>
  );
}

export default App;
