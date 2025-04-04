const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const axios = require("axios");
app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
      origin: "*", // Allow all frontend ports (e.g., 5173, 5174)
      methods: ["GET", "POST"],
    },
  });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI("AIzaSyBXh_QAT7pwIrNyg2Lv1iLTlPd3ysr4IaA");

const ONE_COMPILER_API = "https://onecompiler-apis.p.rapidapi.com/api/v1/run";
const API_HEADERS = {
  "X-RapidAPI-Key": "8fe82ae1f1mshf29d1139a0f8235p15a71ajsne058dbca23d5", // Replace with your API Key
  "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
  "Content-Type": "application/json",
};

// Store code for each room
const roomCodes = {};
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
  
      // Send existing code to the newly joined user
      if (roomCodes[roomId]) {
        socket.emit("codeChange", roomCodes[roomId]);
      }
    });
  
    socket.on("codeChange", ({ roomId, code }) => {
      roomCodes[roomId] = code; // Store latest code for the room
      socket.to(roomId).emit("codeChange", code); // Broadcast changes
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  
  // Code execution endpoint
  app.post("/run", async (req, res) => {
    try {
      const { language, code } = req.body;
  
      // Define correct filename extensions for each language
      const fileExtensions = {
        cpp: "main.cpp",
        python: "main.py",
        java: "Main.java",
        javascript: "main.js",
      };
  
      // Use the correct extension based on the selected language
      const filename = fileExtensions[language] || "main.txt";
  
      const payload = {
        language,
        stdin: "",
        files: [{ name: filename, content: code }],
      };
  
      const response = await axios.post(ONE_COMPILER_API, payload, {
        headers: API_HEADERS,
      });
  
      res.json({ output: response.data.stdout || response.data.stderr });
    } catch (error) {
      console.error("Error executing code:", error.response?.data || error.message);
      res.status(500).json({ error: "Error executing code" });
    }
  });
  
app.post('/api/gemini', async (req, res) => {
    const { prompt } = req.body;
  
    console.log("Received prompt:", prompt);
  
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
  
        const response = await result.response;
        const text = response.text();
  
        console.log("Gemini response:", text);
  
        res.json({ response: text });
    } catch (error) {
        console.error("Gemini API error:", error);
  
        // Detailed error message for debugging
        res.status(500).json({
            error: 'Failed to get AI response',
            details: error.message || error.toString(),
        });
    }
  });
  
  
  // const PORT = process.env.PORT || 5000;
  const PORT = 5001;
  
  server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
  });
