import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '../layout/AppLayout';

interface MeditationProps {
  defaultDuration?: number; // in minutes
  onComplete?: () => void;
}

const MeditationComponent: React.FC<MeditationProps> = ({
  defaultDuration = 5,
  onComplete
}) => {
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [timeRemaining, setTimeRemaining] = useState<number>(defaultDuration * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showEyesClosedAlert, setShowEyesClosedAlert] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio when component mounts
  useEffect(() => {
    // Use a royalty-free meditation music file
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'); 
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      // Show eyes closed alert after 3 seconds of starting
      setTimeout(() => {
        setShowEyesClosedAlert(true);
        setTimeout(() => {
          setShowEyesClosedAlert(false);
        }, 3000);
      }, 3000);
    } else if (isActive && timeRemaining === 0) {
      if (interval) clearInterval(interval);
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (onComplete) onComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setTimeRemaining(duration * 60);
    setIsActive(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  const handlePause = () => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(duration * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <AppLayout>
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
          Meditation
        </h2>
        <p className="mt-1 text-xl sm:text-3xl text-black font-bold tracking-tight">
          Calm your Mind!
        </p>
      </div>
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-[#200f7b] to-[#961aae]  rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Timer</h2>
      {showEyesClosedAlert && (
        <div className="bg-indigo-600 text-white p-4 rounded-md mb-4 animate-pulse text-center">
          Take a deep breath and gently close your eyes
        </div>
      )}
      <div className="bg-white p-8 rounded-full mb-6 shadow-lg">
        <span className="text-5xl font-mono">{formatTime(timeRemaining)}</span>
      </div>
      <div className="mb-6 w-full">
        <label htmlFor="duration" className="block text-sm font-medium text-white mb-1">
          Duration (minutes):
        </label>
        <input
          type="range"
          id="duration"
          min="1"
          max="60"
          value={duration}
          onChange={(e) => {
            const newDuration = parseInt(e.target.value);
            setDuration(newDuration);
            if (!isActive) {
              setTimeRemaining(newDuration * 60);
            }
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={isActive}
        />
        <div className="flex justify-between text-xs text-white">
          <span>1</span>
          <span>15</span>
          <span>30</span>
          <span>45</span>
          <span>60</span>
        </div>
      </div>
      <div className="flex space-x-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow transition"
        >
          Reset
        </button>
      </div>
      <div className="mt-6 text-sm text-white">
        <p>Current session: {duration} minutes</p>
      </div>
    </div>
    </AppLayout>
  );
};

export default MeditationComponent;