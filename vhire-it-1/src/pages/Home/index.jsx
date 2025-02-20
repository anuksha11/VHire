import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(() => {
    if (!value.trim()) {
      setError("Room code is required!");
      return;
    }
    setError("");
    navigate(`/room/${value}`);
  }, [navigate, value]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold text-center mb-4">Join a Meeting</h2>
        <input
          value={value}
          type="text"
          placeholder="Enter your room code"
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          onClick={handleJoinRoom}
          className="w-full mt-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default HomePage;
