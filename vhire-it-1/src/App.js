// src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePages from './pages/Home';
import RoomPage from './pages/Room';
const App = () => {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePages/>} />
        <Route path="/room/:roomId" element={<RoomPage/>} />
      </Routes>
    </div>
  );
};

export default App;