import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

// Sound Files
const inhaleSound = new URL("./inhale.mp3", import.meta.url).href;
const exhaleSound = new URL("./exhale.mp3", import.meta.url).href;
const completeSound = new URL("./complete.mp3", import.meta.url).href;

const BreathingExercise = () => {
  const [phase, setPhase] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [exerciseType, setExerciseType] = useState("box");
  const [customSettings, setCustomSettings] = useState({
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 5,
  });
  const [completedCycles, setCompletedCycles] = useState(0);
  const intervalRef = useRef(null);

  // Breathing Patterns
  const breathingPatterns = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4, cycles: 5 },
    relaxing: { inhale: 4, hold1: 2, exhale: 6, hold2: 0, cycles: 5 },
    energizing: { inhale: 6, hold1: 0, exhale: 4, hold2: 0, cycles: 7 },
  };

  useEffect(() => {
    setCustomSettings(breathingPatterns[exerciseType]);
  }, [exerciseType]);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  useEffect(() => {
    if (isActive) {
      switch (phase) {
        case "inhale":
          playSound(inhaleSound);
          startTimer(
            customSettings.inhale,
            customSettings.hold1 > 0 ? "hold1" : "exhale"
          );
          break;
        case "hold1":
          startTimer(customSettings.hold1, "exhale");
          break;
        case "exhale":
          playSound(exhaleSound);
          startTimer(
            customSettings.exhale,
            customSettings.hold2 > 0 ? "hold2" : "cycleComplete"
          );
          break;
        case "hold2":
          startTimer(customSettings.hold2, "cycleComplete");
          break;
        case "cycleComplete":
          if (completedCycles + 1 >= customSettings.cycles) {
            setIsActive(false);
            setPhase("completed");
            playSound(completeSound);
          } else {
            setCompletedCycles(completedCycles + 1);
            setPhase("inhale");
          }
          break;
        default:
          break;
      }
    }
  }, [isActive, phase]);

  const startTimer = (duration, nextPhase) => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setPhase(nextPhase);
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleExercise = () => {
    if (isActive) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setPhase("idle");
      setTimeLeft(0);
      setCompletedCycles(0);
    } else {
      setIsActive(true);
      setPhase("inhale");
      setCompletedCycles(0);
    }
  };

  const getInstructionText = () => {
    switch (phase) {
      case "idle":
        return "Press start to begin";
      case "inhale":
        return "Inhale slowly";
      case "hold1":
        return "Hold your breath";
      case "exhale":
        return "Exhale slowly";
      case "hold2":
        return "Hold";
      case "completed":
        return "Exercise completed";
      default:
        return "";
    }
  };

  return (
    <AppLayout>
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
          Breathing Exercise
        </h2>
        <p className="mt-1 text-xl sm:text-3xl text-black font-bold tracking-tight">
          Breathe and Be Healthy!
        </p>
      </div>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg py-10">
        {/* Pattern Selection */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Breathing Pattern:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.keys(breathingPatterns).map((pattern) => (
              <button
                key={pattern}
                onClick={() => setExerciseType(pattern)}
                className={`py-2 px-4 rounded-md ${
                  exerciseType === pattern
                    ? "bg-gradient-to-r from-[#200f7b] to-[#961aae] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Guide */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-center z-10">
            <div className="text-xl font-bold">{getInstructionText()}</div>
            {timeLeft > 0 && <div className="text-3xl mt-2">{timeLeft}</div>}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>
              Progress:{" "}
              {Math.round((completedCycles / customSettings.cycles) * 100)}%
            </span>
            <span>
              {completedCycles}/{customSettings.cycles} cycles
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(completedCycles / customSettings.cycles) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={toggleExercise}
            className={`px-6 py-3 rounded-lg font-medium ${
              isActive
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isActive ? "Reset" : phase === "completed" ? "Restart" : "Start"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default BreathingExercise;
