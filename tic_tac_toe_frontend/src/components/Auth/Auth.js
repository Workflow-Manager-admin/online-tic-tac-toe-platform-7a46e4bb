import React, { useState } from "react";

/**
 * Authentication modal/dialog for login and registration.
 * Handles user state and basic input, uses callbacks to perform actions.
 *
 * Props:
 *   - onLogin: function(username, password)
 *   - onSignup: function(username, password)
 *   - error: string (optional)
 */
 // PUBLIC_INTERFACE
function Auth({ onLogin, onSignup, error }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onSignup(username, password);
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Create Account"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            maxLength={50}
            minLength={1}
            placeholder="Username"
            value={username}
            autoComplete="username"
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            maxLength={128}
            placeholder="Password"
            value={password}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <div className="auth-switch">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button type="button" className="link" onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
