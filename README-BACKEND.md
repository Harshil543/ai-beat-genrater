# Suno Beat Maker with Backend Server

This document explains how to set up the backend server to handle Suno API callbacks for the Suno Beat Maker app.

## Overview

The Suno API generates music asynchronously and notifies you when the music is ready via a callback URL. Since the frontend React app cannot directly receive these callbacks, we've created a simple Node.js/Express server that:

1. Receives task IDs from the frontend
2. Provides an endpoint for Suno API to send callbacks to
3. Stores task results in memory (or a database in production)
4. Allows the frontend to poll for task completion

## Setup Instructions

### 1. Install Backend Dependencies

```bash
# From the project root directory
cp server-package.json package.json
npm install
```

### 2. Configure Environment Variables

Create or update the `.env` file in the project root:

```
# Frontend Variables
REACT_APP_SUNO_API_KEY=your_suno_api_key_here
REACT_APP_SERVER_URL=http://localhost:5000

# Backend Variables
PORT=5000
```

### 3. Make the Backend Accessible

For Suno API to send callbacks to your server, it needs to be accessible from the internet. Options:

#### For Development:
- Use [ngrok](https://ngrok.com/) to expose your local server:
  ```bash
  ngrok http 5000
  ```
  Then update your frontend code to use the ngrok URL as the callbackUrl:
  ```
  REACT_APP_SERVER_URL=https://your-ngrok-url.ngrok.io
  ```

#### For Production:
- Deploy to a hosting service like Heroku, DigitalOcean, AWS, etc.
- Set up proper DNS and SSL certificates
- Update the environment variables accordingly

### 4. Start the Server

```bash
# Start both backend and frontend in development mode
npm run dev
```

## API Endpoints

### 1. Initialize Task

```
POST /api/init-task
```
Body:
```json
{
  "taskId": "your_task_id_from_suno"
}
```

### 2. Suno API Callback

This is the endpoint that Suno API will call when music generation is complete:

```
POST /api/suno-callback
```

Suno will send a callback with music data when generation is complete.

### 3. Check Task Status

```
GET /api/task/:taskId
```

Returns the current status and results (if available) for a task.

## Data Flow

1. User selects beat type and clicks "Generate Beat"
2. Frontend sends request to Suno API with our backend's callback URL
3. Suno API returns a task ID
4. Frontend registers this task ID with our backend
5. Frontend starts polling our backend for task status
6. When Suno completes the music generation, it calls our backend's callback URL
7. Our backend stores the result data
8. On the next poll from the frontend, our backend returns the completed task data
9. Frontend displays and plays the generated music

## Debugging

- Check the server logs for incoming callbacks
- Look in the `debug` folder for saved callback data files
- Check the browser console for polling and response information

## Production Considerations

For a production environment, you would want to:

1. Use a database (MongoDB, PostgreSQL, etc.) instead of in-memory storage
2. Implement proper authentication and security measures
3. Set up error handling, logging, and monitoring
4. Configure rate limiting and other API protection measures
5. Set up HTTPS with proper SSL certificates 