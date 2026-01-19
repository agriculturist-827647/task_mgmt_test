import React from 'react';
import TaskList from './components/TaskList';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Task Manager</h1>
        </div>
      </header>
      <main className="main-content">
        <TaskList />
      </main>
    </div>
  );
}

export default App;
