import React, { useEffect, useState } from 'react';
import { fetchTopics, joinTopic } from '../services/api.js';

export default function TopicList({ category, onJoin }){
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, [category]);

  async function load(){
    setLoading(true);
    const data = await fetchTopics(category);
    setTopics(data);
    setLoading(false);
  }

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (!topics.length) return <div className="text-center py-6 text-gray-500">No topics yet — be the first.</div>;

  return (
    <div className="space-y-3">
      {topics.map(t => (
        <div key={t.id} className="card flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-gray-500">{t.tags}</div>
            </div>
            <div className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={async ()=>{ await joinTopic(t.id); onJoin(t); }} className="flex-1 bg-blue-500 text-white py-2 rounded">Join</button>
          </div>
        </div>
      ))}
    </div>
  );
}
