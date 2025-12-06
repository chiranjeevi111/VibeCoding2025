import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchMessages } from '../services/api.js';

let socket;

export default function ChatRoom({ topic, user, onBack }){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ref = useRef();

  useEffect(()=>{
    load();
    // init socket
    socket = io('http://localhost:4000');
    socket.emit('joinTopic', { topicId: topic.id, user });
    socket.on('message', m => setMessages(prev => [...prev, m]));
    return ()=>{ socket.disconnect(); };
  }, [topic.id]);

  async function load(){
    const msgs = await fetchMessages(topic.id);
    setMessages(msgs.map(m=>({ id: m.id, content: m.content, author: m.author ? { name: m.author.name } : { name: 'Anon' }, createdAt: m.createdAt })));
  }

  function send(){
    if (!input.trim()) return;
    socket.emit('message', { content: input });
    setInput('');
  }

  return (
    <div>
      <div className="flex items-center mb-3">
        <button onClick={onBack} className="text-sm text-blue-600">← Back</button>
        <h2 className="flex-1 text-center font-semibold">{topic.title}</h2>
      </div>

      <div className="h-64 overflow-y-auto bg-white p-3 rounded shadow">
        {messages.map(m => (
          <div key={m.id} className="mb-2">
            <div className="text-xs text-gray-500">{m.author?.name || 'Anon'} • {new Date(m.createdAt).toLocaleTimeString()}</div>
            <div className="mt-1">{m.content}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Say hi — keep it kind" />
        <button onClick={send} className="bg-blue-500 text-white px-4 rounded">Send</button>
      </div>
    </div>
  );
}
