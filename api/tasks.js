// Serverless function to list all available tasks
const fs = require('fs');
const path = require('path');

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

  // Only accept GET for listing tasks
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Path to the data directory
    const dataDir = path.join(process.cwd(), 'data');
    
    // If data directory doesn't exist, create it and return empty array
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      return res.status(200).json({ tasks: [] });
    }

    // Read all files in the data directory
    const files = fs.readdirSync(dataDir);
    
    // Filter for only JSON files and extract task information
    const tasks = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          // Extract taskId from filename
          const taskId = file.replace('.json', '');
          
          // Read the file
          const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
          
          // Get the first track if available
          const firstTrack = data.data?.data?.[0] || {};
          
          // Return summary information
          return {
            taskId,
            title: firstTrack.title || 'Untitled',
            type: firstTrack.tags || 'unknown',
            createdAt: new Date(firstTrack.createTime || Date.now()).toISOString(),
            duration: firstTrack.duration || 0,
            trackCount: data.data?.data?.length || 0
          };
        } catch (err) {
          console.error(`Error processing task file ${file}:`, err);
          return {
            taskId: file.replace('.json', ''),
            title: 'Error',
            error: true
          };
        }
      });
    
    // Return the tasks list
    return res.status(200).json({ tasks });
    
  } catch (error) {
    console.error('Error listing tasks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 