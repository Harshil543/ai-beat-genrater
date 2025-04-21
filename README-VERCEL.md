# Suno Beat Maker Webhook for Vercel

This is a serverless webhook implementation that handles callbacks from the Suno API and provides endpoints to access the stored data.

## Features

1. **Webhook Callback Handler**: Receives and processes callbacks from Suno API
2. **Task Data Storage**: Stores generated beat data in local storage
3. **API Endpoints**: Provides APIs to retrieve task information and generated beats
4. **Multiple Tracks**: Supports multiple track versions from a single generation request

## Deployment to Vercel

### Prerequisites

1. A Vercel account
2. The Vercel CLI installed (`npm i -g vercel`)
3. A Suno API key

### Deployment Steps

1. **Clone this repository**:
   ```bash
   git clone <repository-url>
   cd suno-beat-maker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Configure environment variables in Vercel**:
   - Go to the Vercel dashboard
   - Select your project
   - Navigate to "Settings" > "Environment Variables"
   - Add the following variables:
     - `REACT_APP_SUNO_API_KEY` (your Suno API key)
     - `REACT_APP_WEBHOOK_URL` (your deployed webhook URL, e.g., `https://your-vercel-app.vercel.app/api/callback`)
     - `REACT_APP_API_BASE_URL` (your deployed API base URL, e.g., `https://your-vercel-app.vercel.app/api`)

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

## API Endpoints

The webhook provides the following endpoints:

1. **POST `/api/callback`**
   - Receives callbacks from Suno API
   - Body: Suno API callback data

2. **GET `/api/task/:taskId`**
   - Retrieves data for a specific task
   - Path parameter: `taskId` (the ID of the task to retrieve)
   - Response: 
     ```json
     {
       "status": "complete",
       "createdAt": "2023-01-01T00:00:00.000Z",
       "updatedAt": "2023-01-01T00:00:00.000Z",
       "result": {
         "code": 200,
         "data": {
           "callbackType": "complete",
           "data": [
             {
               "audio_url": "https://example.com/audio.mp3",
               "duration": 120.0,
               // other track data...
             }
           ],
           "task_id": "task123"
         },
         "msg": "All generated successfully."
       }
     }
     ```

3. **GET `/api/tasks`**
   - Lists all available tasks
   - Response:
     ```json
     {
       "tasks": [
         {
           "taskId": "task123",
           "title": "Hip Hop Beat",
           "type": "hip-hop",
           "createdAt": "2023-01-01T00:00:00.000Z",
           "duration": 120.0,
           "trackCount": 2
         }
       ]
     }
     ```

## Data Storage

For simplicity, this implementation uses local file storage on Vercel. In a production environment, you should use a proper database such as:

1. **Vercel KV** - For simple key-value storage
2. **MongoDB Atlas** - For document-based storage
3. **Supabase** - For relational database storage
4. **Fauna** - For serverless database

## Important Notes

1. **Stateless Functions**: Vercel serverless functions are stateless, meaning in-memory storage (`dataStore`) will not persist between requests. Only the file-based storage will work in production.

2. **Storage Limitations**: Vercel has limitations on persistent storage. For a production application, use an external database.

3. **Webhook URL**: The Suno API needs to be able to reach your webhook. Make sure your Vercel deployment is publicly accessible.

4. **Request Timeouts**: Vercel has a 10-second timeout for serverless functions. The webhook handler is configured with a higher memory limit and duration to accommodate larger payloads.

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file:
   ```
   REACT_APP_SUNO_API_KEY=your_suno_api_key
   REACT_APP_WEBHOOK_URL=https://webhook.site/your-webhook-id (for testing)
   REACT_APP_API_BASE_URL=http://localhost:3000/api
   ```

3. **Run the development server**:
   ```bash
   vercel dev
   ```

4. **For webhook testing**:
   Use a service like webhook.site to test callbacks during development, or use a tool like ngrok to expose your local server. 