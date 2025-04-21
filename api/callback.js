  // Serverless function to handle Suno API callbacks
  const fs = require('fs');
  const path = require('path');

  // In-memory storage for development
  // For production on Vercel, use a database like MongoDB, Fauna, or Supabase
  let dataStore = new Map();

  // Helper function to save data to a local file (for development)
  const saveToLocalStorage = (taskId, data) => {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Save the data to a JSON file
      const filePath = path.join(dataDir, `${taskId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Data saved to ${filePath}`);
      
      // Also store in memory for quick access
      dataStore.set(taskId, data);
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };

  module.exports = (req, res) => {
    // CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Only accept POST for callbacks
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Log the callback data
      console.log('Received webhook callback:', JSON.stringify(req.body, null, 2));
      e
      const data = req.body;
      
      // Basic validation of the callback data
      if (!data || !data.data || !data.data.task_id) {
        console.error('Invalid callback data:', data);
        return res.status(400).json({ error: 'Invalid callback data' });
      }

      const taskId = data.data.task_id;
      
      // Process only complete callbacks
      if (data.data.callbackType === 'complete') {
        // Save the data both in memory and to local storage
        saveToLocalStorage(taskId, data);
        
        console.log(`Task ${taskId} processed successfully with ${data.data.data.length} tracks`);
      } else {
        console.log(`Received non-complete callback for task ${taskId}: ${data.data.callbackType}`);
      }

      // Acknowledge receipt of callback
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing callback:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }; 