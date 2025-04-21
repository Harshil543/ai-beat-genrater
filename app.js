const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// API Routes
app.get('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const taskPath = path.join(dataDir, `${taskId}.json`);
  
  if (fs.existsSync(taskPath)) {
    const taskData = JSON.parse(fs.readFileSync(taskPath, 'utf8'));
    res.json(taskData);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.get('/api/tasks', (req, res) => {
  try {
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    const tasks = files.map(file => {
      const taskData = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      return taskData;
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

app.post('/api/callback', (req, res) => {
  try {
    const { taskId, result } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: 'Missing taskId' });
    }
    
    const taskPath = path.join(dataDir, `${taskId}.json`);
    fs.writeFileSync(taskPath, JSON.stringify({ taskId, result, timestamp: new Date() }));
    
    res.json({ success: true, message: 'Callback processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process callback' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Suno Beat Maker API',
    endpoints: [
      { method: 'GET', path: '/api/tasks/:id', description: 'Get a specific task by ID' },
      { method: 'GET', path: '/api/tasks', description: 'List all tasks' },
      { method: 'POST', path: '/api/callback', description: 'Process callback from Suno API' }
    ]
  });
});

// Start server
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 