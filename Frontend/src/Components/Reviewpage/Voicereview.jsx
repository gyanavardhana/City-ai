import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Voicereview = ({ locationId, onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const token = Cookies.get('authToken');

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = handleStop;

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing audio stream:', err);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleStop = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
    chunksRef.current = [];

    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_review.wav');

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      onTranscript(response.data.transcription);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError('Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!('webkitSpeechRecognition' in window)) {
    return (
      <div className="border border-red-300 bg-red-50 rounded-lg p-5 max-w-md mx-auto my-5">
        <div className="flex items-center justify-center text-red-600 mb-3">
          <AlertCircle size={24} className="mr-2" />
          <h2 className="text-lg font-semibold">Unsupported Browser</h2>
        </div>
        <p className="text-center text-red-600">
          Your browser does not support speech recognition. Please try using a modern browser like Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-5 max-w-md mx-auto my-5 bg-white shadow-md">
      <h2 className="text-center mb-5 text-xl font-semibold text-gray-800">Voice Review</h2>
      <div className="flex flex-col items-center mb-5">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`flex items-center justify-center px-6 py-3 rounded-full transition-all duration-300 ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isLoading ? (
            <Loader size={24} className="animate-spin mr-2" />
          ) : isRecording ? (
            <Square size={24} className="mr-2" />
          ) : (
            <Mic size={24} className="mr-2" />
          )}
          {isLoading ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <div className="mt-3 text-gray-600 font-medium">
            Recording: {formatTime(recordingTime)}
          </div>
        )}
      </div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Voicereview;