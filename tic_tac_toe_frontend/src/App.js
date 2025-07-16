import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth } from './components/Auth';
import { loginUser, registerUser, getCurrentUser } from './services/api';

/**
 * Main App component - handles global theme, authentication, and routing structure.
 * Shows Auth dialog for login/registration; maintains user/JWT state.
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); // { id, username, ... }
  const [authError, setAuthError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // On mount, check for saved JWT and try to fetch user
  useEffect(() => {
    async function fetchUserIfToken() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoadingUser(false);
        return;
      }
      try {
        const me = await getCurrentUser(token);
        setUser(me);
      } catch (err) {
        // Token invalid/expired
        localStorage.removeItem('access_token');
        setUser(null);
      }
      setLoadingUser(false);
    }
    fetchUserIfToken();
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Auth handlers
  // PUBLIC_INTERFACE
  async function handleLogin(username, password) {
    setAuthError('');
    try {
      const data = await loginUser(username, password);
      // fetch user profile with new token
      const me = await getCurrentUser(data.access_token);
      setUser(me);
      setAuthError('');
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    }
  }

  // PUBLIC_INTERFACE
  async function handleSignup(username, password) {
    setAuthError('');
    try {
      await registerUser(username, password);
      // Auto-login after signup
      await handleLogin(username, password);
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
    }
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    setUser(null);
    localStorage.removeItem('access_token');
  }

  // Show a loading spinner during user check
  if (loadingUser) {
    return (
      <div className="App">
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  // If not authenticated, show Auth UI
  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
        <Auth onLogin={handleLogin} onSignup={handleSignup} error={authError} />
      </div>
    );
  }

  // Authenticated UI placeholder (replace with main game/board/sidebar features)
  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome, <strong>{user.username}</strong>!
        </p>
        <button onClick={handleLogout} style={{
          background: "#e87a41", color: 'white', border: 'none',
          borderRadius: 8, padding: '8px 18px', fontWeight: 600, margin: '18px 0', cursor: 'pointer'
        }}>
          Log Out
        </button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
