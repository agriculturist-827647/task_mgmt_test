import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import Header from './components/Header';
import './styles/App.css';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {user ? (
        <>
          <Header />
          <main className="main-content">
            <TaskList />
          </main>
        </>
      ) : (
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Task Manager</h1>
            <p className="auth-subtitle">Organize your tasks efficiently</p>

            {showRegister ? (
              <>
                <Register />
                <p className="auth-switch">
                  Already have an account?{' '}
                  <button
                    className="link-button"
                    onClick={() => setShowRegister(false)}
                  >
                    Login
                  </button>
                </p>
              </>
            ) : (
              <>
                <Login />
                <p className="auth-switch">
                  Don't have an account?{' '}
                  <button
                    className="link-button"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
