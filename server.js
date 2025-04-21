const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Store active task data in memory (for a production app, use a database)
const activeTasks = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// Endpoint to initialize a task
app.post('/api/init-task', (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  // Store task info with pending status
  activeTasks.set(taskId, { 
    status: 'pending',
    createdAt: new Date().toISOString(),
    result: null
  });
  
  console.log(`Task initialized: ${taskId}`);
  res.json({ success: true, taskId });
});

// Endpoint for Suno API callbacks
app.post('/api/suno-callback', (req, res) => {
  console.log('Received callback from Suno API:', JSON.stringify(req.body, null, 2));
  
  const data = req.body;
  
  // Validate callback data
  if (!data || !data.data || !data.data.task_id) {
    console.error('Invalid callback data');
    return res.status(400).json({ error: 'Invalid callback data' });
  }
  
  const taskId = data.data.task_id;
  
  // Check if we know about this task
  if (!activeTasks.has(taskId)) {
    console.warn(`Received callback for unknown task: ${taskId}`);
    // Still accept the callback
    activeTasks.set(taskId, {
      status: 'complete',
      updatedAt: new Date().toISOString(),
      result: data
    });
  } else {
    // Update the task data
    const taskData = activeTasks.get(taskId);
    activeTasks.set(taskId, {
      ...taskData,
      status: 'complete',
      updatedAt: new Date().toISOString(),
      result: data
    });
  }
  
  console.log(`Task ${taskId} updated with status: complete`);
  
  // Acknowledge receipt of callback
  res.status(200).json({ success: true });
  
  // For debugging - write callback data to a file
  const debugDir = path.join(__dirname, 'debug');
  if (!fs.existsSync(debugDir)) {
    fs.mkdirSync(debugDir);
  }
  fs.writeFileSync(
    path.join(debugDir, `callback-${taskId}.json`), 
    JSON.stringify(data, null, 2)
  );
});

// Endpoint to check task status
app.get('/api/task/:taskId', (req, res) => {
  const { taskId } = req.params;
  
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }
  
  // Check if task exists
  if (!activeTasks.has(taskId)) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const taskData = activeTasks.get(taskId);
  res.json(taskData);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Callback URL: http://localhost:${PORT}/api/suno-callback`);
}); 