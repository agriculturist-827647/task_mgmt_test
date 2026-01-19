import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Task Manager</h1>
        <div className="header-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
