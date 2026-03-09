
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { Message } from '../types/chat';


const ChatPage = () => {
  const { targetId } = useParams<{ targetId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 useEffect(() => {
  const token = localStorage.getItem('access');
  if (!token) return;

  const ws = new WebSocket(`ws://localhost/ws/chat?token=${token}&target_id=${targetId}`);
  socketRef.current = ws;

  ws.onopen = () => {
    console.log("WebSocket Connected Successfully");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "history") {
      setMessages(data.data);
    } else {
      setMessages((prev) => [...prev, data]);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  ws.onclose = (event) => {
    console.log("WebSocket Closed:", event.code, event.reason);
  };

  // CLEANUP FUNCTION: This is crucial
  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}, [targetId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const payload = {
      receiver_id: parseInt(targetId || "1"),
      message: input
    };

    // 1. Send via WebSocket
    socketRef.current.send(JSON.stringify(payload));

    // 2. Optimistic Update: Add to our own screen immediately
    const myId = 0; // Ideally get this from your Auth context/JWT
    setMessages((prev) => [...prev, { sender_id: myId, message: input }]);
    
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border shadow-lg">
      <div className="p-4 bg-blue-600 text-white font-bold">Chat Support</div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender_id.toString() === targetId ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              msg.sender_id.toString() === targetId ? 'bg-white text-gray-800' : 'bg-blue-500 text-white'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;