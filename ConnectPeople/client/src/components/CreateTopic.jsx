import React, { useState } from 'react';
import { createTopic } from '../services/api.js';

export default function CreateTopic({ category, onCreated, user, setUser }){
  const [title, setTitle] = useState('');
  const [anonymous, setAnonymous] = useState(user.anonymous);
  const [tags, setTags] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    const payload = { title, category, anonymous, name: anonymous ? undefined : user.name, tags: tags.split(',').map(t=>t.trim()).filter(Boolean) };
    const topic = await createTopic(payload);
    onCreated(topic);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <label className="block text-sm font-medium">What do you want to discuss?</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} required className="w-full p-2 mt-2 border rounded" />

      <label className="mt-3 block text-sm">Tags (comma separated)</label>
      <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full p-2 mt-2 border rounded" />

      <div className="flex items-center gap-2 mt-3">
        <input id="anon" type="checkbox" checked={anonymous} onChange={e=>{ setAnonymous(e.target.checked); setUser(u=>({ ...u, anonymous: e.target.checked })); }} />
        <label htmlFor="anon" className="text-sm">Post anonymously</label>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded">Create & Join</button>
      </div>
    </form>
  );
}
