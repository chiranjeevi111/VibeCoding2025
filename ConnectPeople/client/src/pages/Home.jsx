import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs.jsx';
import TopicList from '../components/TopicList.jsx';
import CreateTopic from '../components/CreateTopic.jsx';
import ChatRoom from '../components/ChatRoom.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import { logout, generateAnon } from '../utils/anon.js';

const categories = ['Tea','Restaurant','Park','Bar'];

export default function App(){
  const [authMode, setAuthMode] = useState('checking'); // checking | login | signup | authenticated
  const [category, setCategory] = useState('Tea');
  const [page, setPage] = useState('list'); // list | create | chat
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [user, setUser] = useState(null);
  const [signupMessage, setSignupMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('tt_token');
    const storedUser = localStorage.getItem('tt_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setAuthMode('authenticated');
      } catch (err) {
        setAuthMode('login');
      }
    } else {
      setAuthMode('login');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthMode('authenticated');
    setPage('list');
  };

  const handleSignupSuccess = (message) => {
    if (message === 'LOGIN') {
      setAuthMode('login');
      setSignupMessage('');
    } else {
      setSignupMessage(message);
      setTimeout(() => setAuthMode('login'), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthMode('login');
    setPage('list');
  };

  if (authMode === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authMode === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthMode('signup')}
      />
    );
  }

  if (authMode === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  // Authenticated view
  return (
    <div className="safe-area max-w-md mx-auto">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold">TeaTalk Connect</h1>
        <div className="flex gap-2 items-center">
          <div className="text-sm text-gray-600">{user?.name || 'User'}</div>
          <button 
            onClick={handleLogout}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <Tabs categories={categories} value={category} onChange={c=>{setCategory(c); setPage('list');}} />

      <main className="mt-4">
        {page === 'list' && (
          <>
            <div className="flex gap-2 mb-3">
              <button className="flex-1 btn bg-blue-500 text-white p-2 rounded" onClick={()=>setPage('create')}>Create Topic</button>
            </div>
            <TopicList category={category} onJoin={(topic)=>{ setSelectedTopic(topic); setPage('chat'); }} />
          </>
        )}

        {page === 'create' && (
          <CreateTopic category={category} onCreated={(t)=>{ setSelectedTopic(t); setPage('chat'); }} user={user} />
        )}

        {page === 'chat' && selectedTopic && (
          <ChatRoom topic={selectedTopic} user={user} onBack={()=>setPage('list')} />
        )}
      </main>
    </div>
  );
}
