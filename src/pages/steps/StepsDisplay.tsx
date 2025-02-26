import { useState, useEffect, useRef } from "react";
import { supabase } from "../../config/supabaseClient";
import { AppLayout } from "@/components/layout/AppLayout";

const StepsDisplay = () => {
  const [stepCount, setStepCount] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [newGoal, setNewGoal] = useState(10000);
  const [isCounting, setIsCounting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [calories, setCalories] = useState<number>(
    parseFloat((stepCount * 0.04).toFixed(2))
  );
  const [distance, setDistance] = useState<number>(
    parseFloat((stepCount * 0.0008).toFixed(2))
  );
  const [radius, setRadius] = useState<number>(60);
  const strokeWidth = 10;

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth >= 640 ? 90 : 60);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - Math.min(stepCount / goal, 1) * circumference;

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isCounting]);

  useEffect(() => {
    if (stepCount > 0) {
      updateStepCount(stepCount);
    }
    setCalories(parseFloat((stepCount * 0.04).toFixed(2)));
    setDistance(parseFloat((stepCount * 0.0008).toFixed(2)));
  }, [stepCount]);

  // Fetch User ID from Supabase
  const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    }
    setUserId(data?.user?.id || null);
    if (data?.user?.id) {
      fetchGoal(data.user.id);
      fetchStepCount(data.user.id);
    }
  };

  // Fetch goal from Supabase
  const fetchGoal = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("steps")
        .select("goal_steps")
        .eq("user_id", uid)
        .maybeSingle();

      if (error) throw error;
      if (data?.goal_steps !== undefined) {
        setGoal(data.goal_steps);
        setNewGoal(data.goal_steps);
      }
    } catch (error) {
      console.error("Error fetching goal:", error);
    }
  };

  // Fetch step count from Supabase
  const fetchStepCount = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("steps")
        .select("step_count")
        .eq("user_id", uid)
        .maybeSingle();

      if (error) throw error;
      if (data?.step_count !== undefined) {
        setStepCount(data.step_count);
      }
    } catch (error) {
      console.error("Error fetching step count:", error);
    }
  };

  // Update step count in Supabase
  const updateStepCount = async (steps: number) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("steps")
        .upsert([{ user_id: userId, step_count: steps }], {
          onConflict: "user_id",
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating step count:", error);
    }
  };

  // Update goal in Supabase
  const updateGoal = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("steps")
        .upsert([{ user_id: userId, goal_steps: newGoal }], {
          onConflict: "user_id",
        });

      if (error) throw error;
      setGoal(newGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const stepInterval = useRef<NodeJS.Timeout | null>(null);

  const startCounting = (intervalTime: number) => {
    alert(`Starting step counter...`);
    setIsCounting(true);

    if (stepInterval.current) clearInterval(stepInterval.current); // Clear any existing interval

    stepInterval.current = setInterval(() => {
      setStepCount((prevCount) => prevCount + 1);
    }, intervalTime);
  };

  const stopCounting = () => {
    alert("Stopping the step counter...");
    setIsCounting(false);

    if (stepInterval.current) {
      clearInterval(stepInterval.current);
      stepInterval.current = null;
    }
    updateStepCount(stepCount);
    alert(`Step counting stopped. Final count: ${stepCount}`);
  };

  useEffect(() => {
    return () => {
      if (stepInterval.current) {
        clearInterval(stepInterval.current);
      }
    };
  }, []);

  return (
    <AppLayout>
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
          Steps Tracker
        </h2>
        <p className="mt-1 text-xl sm:text-3xl text-black font-bold tracking-tight">
          Track your steps and burn your calories!
        </p>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#351289] to-[#6E17A0] text-white p-4 ">
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-black">
              Set Your Goal
            </label>
            <input
              type="number"
              className="w-full p-2 border-none rounded-lg text-black bg-gray-100 focus:outline-none"
              value={newGoal === 0 ? "" : newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              placeholder="Enter step goal"
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={updateGoal}
            >
              Set Goal
            </button>
          </div>

          {/* Timer & Status */}
          <div className="mb-4 text-lg font-semibold text-black">
            ⏱️ Time: {Math.floor(elapsedTime / 60)}:
            {elapsedTime % 60 < 10 ? `0${elapsedTime % 60}` : elapsedTime % 60}
          </div>
          <div
            className={`mb-2 text-lg font-semibold ${
              isCounting ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCounting ? "Recording..." : "Not Recording"}
          </div>

          <div className="bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text text-xl sm:text-2xl font-bold leading-7 ">
            {stepCount >= goal
              ? "Goal Achieved!"
              : "Keep Walking to achieve the Goal!"}
          </div>

          <div className="flex flex-col gap-6 items-center justify-start w-full p-6 sm:p-8">
            {/* Steps Tracker Section*/}
            <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-4xl bg-white p-2 rounded-2xl shadow-xl">
              {/* Circular Step Counter */}
              <div className="relative w-40 h-40 sm:w-64 sm:h-64 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#e0e0e0"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />

                  {/* Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />

                  {/* Gradient for Stroke */}
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#200f7b" />
                      <stop offset="100%" stopColor="#961aae" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Step Count Display */}
                <span className="absolute text-lg sm:text-xl font-bold text-gray-800">
                  {stepCount} Steps
                </span>
              </div>

              {/* Calories and Distance Info */}
              <div className="mt-4 sm:mt-0 sm:ml-5 flex flex-col items-center justify-center text-gray-800">
                <p className="text-md sm:text-lg font-semibold">
                  {calories} kcal
                </p>
                <p className="text-sm sm:text-md text-center">
                  Calories Burned
                </p>
                <p className="mt-4 text-md sm:text-lg font-semibold">
                  {distance} km
                </p>
                <p className="text-sm sm:text-md text-center">
                  Distance Walked
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => startCounting(1100)}
              style={{
                fontSize: "18px",
                padding: "10px 20px",
                margin: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#3498db",
                color: "white",
              }}
            >
              Slow Pace Start
            </button>
            <button
              onClick={() => startCounting(950)}
              style={{
                fontSize: "18px",
                padding: "10px 20px",
                margin: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#f1c40f",
                color: "white",
              }}
            >
              Medium Pace Start
            </button>
            <button
              onClick={() => startCounting(800)}
              style={{
                fontSize: "18px",
                padding: "10px 20px",
                margin: "10px",
                cursor: "pointer",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#e74c3c",
                color: "white",
              }}
            >
              Fast Pace Start
            </button>
          </div>
          <button
            onClick={stopCounting}
            style={{
              fontSize: "18px",
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#2c3e50",
              color: "white",
            }}
          >
            Stop Counting
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default StepsDisplay;
