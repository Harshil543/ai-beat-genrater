// Serverless function to retrieve task data by taskId
const fs = require('fs');
const path = require('path');

// Reference to the shared in-memory storage
// This is for development. In production, use a database
let dataStore = new Map();

// Helper function to load data from local storage
const loadFromLocalStorage = (taskId) => {
  try {
    const filePath = path.join(process.cwd(), 'data', `${taskId}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      // Cache in memory for future requests
      dataStore.set(taskId, data);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error loading data for task ${taskId}:`, error);
    return null;
  }
};

module.exports = (req, res) => {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept GET for task retrieval
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract taskId from URL
    const { taskId } = req.query;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Missing taskId parameter' });
    }

    console.log(`Fetching data for task: ${taskId}`);
    
    // First check in-memory store
    let taskData = dataStore.get(taskId);
    
    // If not in memory, try to load from file
    if (!taskData) {
      taskData = loadFromLocalStorage(taskId);
    }
    
    // If still not found, task doesn't exist
    if (!taskData) {
      return res.status(404).json({ 
        error: 'Task not found',
        status: 'pending',
        message: 'The task does not exist or has not completed yet'
      });
    }
    
    // Return the task data
    return res.status(200).json({
      status: 'complete',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result: taskData
    });
    
  } catch (error) {
    console.error('Error retrieving task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 