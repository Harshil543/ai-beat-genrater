import React, { createContext, useState, useEffect } from 'react';

// Default to localhost for development, but will use the deployed URL in production
const WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL || "https://webhook.site/90a58c92-ac97-4e7d-9ae2-9201064a78c9";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://prashil-api.vercel.app/api";

export const SunoContext = createContext();

export const SunoProvider = ({ children }) => {
  const [beatType, setBeatType] = useState('hip-hop');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [trackList, setTrackList] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [allTasks, setAllTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await fetch(`https://prashil-api.vercel.app/api/suno/tracks`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, '"data"');
      setAllTasks(data.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const generateBeat = async () => {
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    setTaskId(null);
    setPollingAttempts(0);
    setTrackList([]);

    try {
      console.log('Generating beat:', beatType);

      // Prepare callback URL to our webhook
      const callbackUrl = WEBHOOK_URL;
      console.log('Using callback URL:', callbackUrl);

      // Step 1: Make the initial request to generate music
      const response = await fetch('https://apibox.erweima.ai/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUNO_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Create a high-quality ${beatType} instrumental beat featuring a strong rhythmic foundation, genre-specific percussion, and a professionally arranged structure. Emphasize elements commonly found in top-charting ${beatType} tracks. Ensure the beat is loopable and suitable for background use or freestyle performance.`,
          customMode: true,
          instrumental: true,
          style: beatType,
          title: `${beatType.charAt(0).toUpperCase() + beatType.slice(1)} Beat`,
          model: 'V4',
          callBackUrl: "https://prashil-api.vercel.app/api/suno/webhook"
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to generate beat: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.code !== 200) {
        throw new Error(`API error: ${data.msg}`);
      }

      const newTaskId = data.data.taskId;
      setTaskId(newTaskId);

      // Step 2: Poll for task status
      await pollTaskStatus(newTaskId);

    } catch (err) {
      console.error('Error generating beat:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const pollTaskStatus = async (taskId) => {
    try {
      setPollingAttempts(prev => prev + 1);

      // Poll our API for task status
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`);

      if (!response.ok) {
        // If 404, the task hasn't completed yet
        if (response.status === 404) {
          console.log(`Task ${taskId} not found yet. Polling attempt ${pollingAttempts}/40...`);
          if (pollingAttempts < 40) { // Poll for up to 10 minutes (40 attempts x 15 seconds)
            setTimeout(() => pollTaskStatus(taskId), 15000); // Poll every 15 seconds
          } else {
            throw new Error('Task polling timed out. The callback may not have been received yet.');
          }
          return;
        }
        throw new Error(`Failed to check task status: ${response.status}`);
      }

      const taskData = await response.json();
      console.log('Task data:', taskData);

      if (taskData.status === 'complete' && taskData.result?.data?.data) {
        // Process the completed task data
        handleTaskComplete(taskData.result);

        // Refresh the task list
        fetchAllTasks();
      } else {
        // If status isn't complete, continue polling
        if (pollingAttempts < 40) {
          setTimeout(() => pollTaskStatus(taskId), 15000);
        } else {
          throw new Error('Task is taking longer than expected. Check back later for results.');
        }
      }

    } catch (err) {
      console.error('Error polling task status:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleTaskComplete = (data) => {
    try {
      if (!data.data || !data.data.data || !data.data.data.length) {
        throw new Error('Invalid task completion data');
      }

      // Get the tracks from the data
      const tracks = data.data.data;
      setTrackList(tracks);

      // Set the first track as the selected track
      selectTrack(0);

      console.log(`Success! Received ${tracks.length} tracks.`);
    } catch (err) {
      console.error('Error processing completed task:', err);
      setError('Error processing the generated beat: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectTrack = (index) => {
    if (index < 0 || index >= trackList.length) {
      console.error(`Invalid track index: ${index}. Available tracks: ${trackList.length}`);
      return;
    }

    setSelectedTrack(index);
    const track = trackList[index];
    setAudioUrl(track.audio_url);
    console.log(`Selected track ${index + 1}/${trackList.length}: ${track.title}`);
  };

  const loadTask = async (taskId) => {
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    setTaskId(taskId);
    setPollingAttempts(0);
    setTrackList([]);

    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`);

      if (!response.ok) {
        throw new Error(`Failed to load task: ${response.status}`);
      }

      const taskData = await response.json();

      if (taskData.status === 'complete' && taskData.result?.data?.data) {
        handleTaskComplete(taskData.result);
      } else {
        throw new Error('Invalid task data');
      }
    } catch (err) {
      console.error('Error loading task:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <SunoContext.Provider
      value={{
        beatType,
        setBeatType,
        isLoading,
        audioUrl,
        error,
        generateBeat,
        taskId,
        pollingAttempts,
        trackList,
        selectedTrack,
        selectTrack,
        allTasks,
        loadingTasks,
        fetchAllTasks,
        loadTask
      }}
    >
      {children}
    </SunoContext.Provider>
  );
}; 