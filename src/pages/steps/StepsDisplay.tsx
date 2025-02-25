import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
// import MeditationComponent from "@/components/Meditation/MeditationComponent";
 
const StepsDisplay = () => {
  const [stepCount, setStepCount] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [newGoal, setNewGoal] = useState(10000);
  const [isCounting, setIsCounting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [deltaValues, setDeltaValues] = useState({ x: 0, y: 0, z: 0 });
 
 
 
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
  const progressOffset = circumference - (stepCount / goal) * circumference;
 
  // Motion Detection Variables
  const threshold: number = 4;
  let lastX: number = 0,
    lastY: number = 0,
    lastZ: number = 0;
 
  useEffect(() => {
    getUserId();
  }, []);
 
  useEffect(() => {
    let timer: NodeJS.Timeout;
 
    if (isCounting) {
      window.addEventListener("devicemotion", detectMotion);
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      window.removeEventListener("devicemotion", detectMotion);
      clearInterval(timer);
    }
 
    return () => {
      window.removeEventListener("devicemotion", detectMotion);
      clearInterval(timer);
    };
  }, [isCounting]);
 
  // 🔹 Fetch User ID from Supabase
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
 
  // 🔹 Fetch goal from Supabase
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
 
  // 🔹 Fetch step count from Supabase
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
 
  useEffect(() => {
    setCalories(parseFloat((stepCount * 0.04).toFixed(2)));
    setDistance(parseFloat((stepCount * 0.0008).toFixed(2)));
  }, [stepCount]);
 
  // 🔹 Update step count in Supabase
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
 
  // 🔹 Update goal in Supabase
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
 
  // 🔹 Detect Motion and Count Steps
  const detectMotion = (event: DeviceMotionEvent) => {
    if (!isCounting) return;
 
    let { x = 0, y = 0, z = 0 } = event.acceleration ?? {};
 
    let deltaX = Math.abs(x - lastX);
    let deltaY = Math.abs(y - lastY);
    let deltaZ = Math.abs(z - lastZ);
 
    setDeltaValues({ x: deltaX, y: deltaY, z: deltaZ });
 
    if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
      setStepCount((prev) => {
        const newStepCount = prev + 1;
        updateStepCount(newStepCount);
        return newStepCount;
      });
    }
 
    lastX = x;
    lastY = y;
    lastZ = z;
  };
 
  // 🔹 Start Counting (Fix: Keeps saved step count)
  const startCounting = () => {
    setElapsedTime(0);
    setIsCounting(true);
  };
 
  // 🔹 Stop Counting
  const stopCounting = () => {
    setIsCounting(false);
  };
 
  const progress = Math.min((stepCount / goal) * 100, 100);
 
  return (
    <AppLayout>
      {/* <MeditationComponent/> */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#351289] to-[#6E17A0] text-white p-4 ">
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
            Step Counter
          </h1>
 
          {/* Step Goal Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-black">
              Set Your Goal
            </label>
            <input
              type="number"
              className="w-full p-2 border-none rounded-lg text-black bg-gray-100 focus:outline-none"
              value={newGoal}
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
            className={`mb-4 text-lg font-bold ${
              isCounting ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCounting ? "Recording..." : "Not Recording"}
          </div>
 
          {/*Delta Values */}
          <div className="mb-4 bg-gray-800 p-4 rounded-lg">
            <p>ΔX: {deltaValues.x.toFixed(2)}</p>
            <p>ΔY: {deltaValues.y.toFixed(2)}</p>
            <p>ΔZ: {deltaValues.z.toFixed(2)}</p>
          </div>
 
          <div className="flex flex-col gap-6 items-center justify-start w-full p-6 sm:p-8">
            {/* Steps Tracker Section*/}
            <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-4xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
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
              <div className="mt-4 sm:mt-0 sm:ml-10 flex flex-col items-center sm:items-start text-gray-800">
                <p className="text-lg sm:text-xl font-semibold">
                  {calories} kcal
                </p>
                <p className="text-sm sm:text-md">Calories Burned</p>
                <p className="mt-4 text-lg sm:text-xl font-semibold">
                  {distance} km
                </p>
                <p className="text-sm sm:text-md">Distance Walked</p>
              </div>
            </div>
          </div>
 
          {/* Buttons */}
          <div className="flex space-x-4 justify-center">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={startCounting}
            >
              Start
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={stopCounting}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
 
export default StepsDisplay;





// // import React, { useState, useEffect } from "react";
// // import { AppLayout } from "@/components/layout/AppLayout";

// // const StepsDisplay: React.FC = () => {
// //   const [steps, setSteps] = useState<number>(3000);
// //   const [calories, setCalories] = useState<number>(parseFloat((3000 * 0.04).toFixed(2)));
// //   const [distance, setDistance] = useState<number>(parseFloat((3000 * 0.0008).toFixed(2)));
// //   const [radius, setRadius] = useState<number>(60);
// //   const strokeWidth = 10;
  
// //   useEffect(() => {
// //     const handleResize = () => {
// //       setRadius(window.innerWidth >= 640 ? 90 : 60);
// //     };
    
// //     handleResize(); // Set initial value
// //     window.addEventListener("resize", handleResize);
    
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   const circumference = 2 * Math.PI * radius;
// //   const progressOffset = circumference - (steps / 10000) * circumference;

// //   return (
// //     <AppLayout>
// //       <div className="flex flex-col gap-6 items-center justify-start w-full min-h-screen p-6 sm:p-8">
// //         {/* Header */}
// //         <div className="text-center">
// //           <h2 className="font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
// //             Steps Tracker
// //           </h2>
// //           <p className="mt-1 text-xl sm:text-3xl font-bold tracking-tight">
// //             Keep Walking and Burn Calories!
// //           </p>
// //         </div>

// //         {/* Steps Tracker Section */}
// //         <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-4xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
// //           {/* Circular Step Counter */}
// //           <div className="relative w-40 h-40 sm:w-64 sm:h-64 flex items-center justify-center">
// //             <svg className="w-full h-full" viewBox="0 0 200 200">
// //               {/* Background Circle */}
// //               <circle
// //                 cx="100"
// //                 cy="100"
// //                 r={radius}
// //                 stroke="#e0e0e0"
// //                 strokeWidth={strokeWidth}
// //                 fill="none"
// //               />

// //               {/* Progress Circle */}
// //               <circle
// //                 cx="100"
// //                 cy="100"
// //                 r={radius}
// //                 stroke="url(#progressGradient)"
// //                 strokeWidth={strokeWidth}
// //                 fill="none"
// //                 strokeDasharray={circumference}
// //                 strokeDashoffset={progressOffset}
// //                 strokeLinecap="round"
// //                 transform="rotate(-90 100 100)"
// //               />

// //               {/* Gradient for Stroke */}
// //               <defs>
// //                 <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
// //                   <stop offset="0%" stopColor="#200f7b" />
// //                   <stop offset="100%" stopColor="#961aae" />
// //                 </linearGradient>
// //               </defs>
// //             </svg>

// //             {/* Step Count Display */}
// //             <span className="absolute text-lg sm:text-xl font-bold text-gray-800">
// //               {steps} Steps
// //             </span>
// //           </div>

// //           {/* Calories and Distance Info */}
// //           <div className="mt-6 sm:mt-0 sm:ml-10 flex flex-col items-center sm:items-start text-gray-800">
// //             <p className="text-xl sm:text-2xl font-semibold">{calories} kcal</p>
// //             <p className="text-md sm:text-lg">Calories Burned</p>
// //             <p className="mt-4 text-xl sm:text-2xl font-semibold">{distance} km</p>
// //             <p className="text-md sm:text-lg">Distance Walked</p>
// //           </div>
// //         </div>
// //       </div>
// //     </AppLayout>
// //   );
// // };

// // export default StepsDisplay;






// // // Working code with 2 comments in it

// // // import React, { useState, useEffect } from "react";
// // // import { AppLayout } from "@/components/layout/AppLayout";
// // // // import WeekProgress from "./WeekProgress";
 
// // // // interface StepsData {
// // // //   stepsToday: number;
// // // // }
 
// // // const StepsDisplay: React.FC = () => {
// // //   const [steps, setSteps] = useState<number>(0);
// // //   const [calories, setCalories] = useState<number>(0);
// // //   const [distance, setDistance] = useState<number>(0);
// // // // const [error, setError] = useState<string | null>(null);
 
  
// // // //   useEffect(() => {
// // // //     const eventSource = new EventSource("http://localhost:5000/get-steps/2");
 
// // // //     eventSource.onmessage = (event: MessageEvent) => {
// // // //       try {
// // // //         const data: StepsData = JSON.parse(event.data);
// // // //         if (data.stepsToday !== undefined) {
// // // //           setSteps(data.stepsToday);
// // // //           setCalories(parseFloat((data.stepsToday * 0.04).toFixed(2)));
// // // //           setDistance(parseFloat(((data.stepsToday * 0.0008)).toFixed(2))); // Assuming 1 step = 0.8m
// // // //         }
// // // //       } catch (err) {
// // // //         setError("Error parsing data");
// // // //       }
// // // //     };
 
// // // //     eventSource.onerror = () => {
// // // //       setError("Failed to fetch steps. Ensure Google Fit is connected.");
// // // //       eventSource.close();
// // // //     };
 
// // // //     return () => {
// // // //       eventSource.close();
// // // //     };
// // // //   }, []);

// // //   useEffect(()=>{
// // //           setSteps(3000);
// // //           setCalories(parseFloat((3000* 0.04).toFixed(2)));
// // //           setDistance(parseFloat(((3000 * 0.0008)).toFixed(2)));
// // //   },[])
 
// // //   return (
// // //     <AppLayout>
// // //       <div className="flex flex-col gap-8 items-center justify-start animate-fade-in w-full h-screen p-8">
// // //         <div className="text-center">
// // //           <h2 className="font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
// // //             Steps Tracker
// // //           </h2>
// // //           <p className="mt-1 text-3xl font-bold tracking-tight">
// // //             Keep Walking and Burn Calories!
// // //           </p>
// // //         </div>
 
// // //         <div className="flex items-center justify-center w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl">
// // //           {/* Circular Step Counter */}
// // //           <div className="relative w-64 h-64 flex items-center justify-center">
// // //             <svg className="w-full h-full">
// // //               <circle cx="50%" cy="50%" r="90" stroke="#e0e0e0" strokeWidth="12" fill="none" />
// // //               <circle
// // //                 cx="50%"
// // //                 cy="50%"
// // //                 r="90"
// // //                 stroke="url(#progressGradient)"
// // //                 strokeWidth="12"
// // //                 fill="none"
// // //                 strokeDasharray="565"
// // //                 strokeDashoffset={565 - (steps / 10000) * 565}
// // //                 strokeLinecap="round"
// // //                 transform="rotate(-90 128 128)"
// // //               />
// // //               <defs>
// // //                 <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
// // //                   <stop offset="0%" stopColor="#200f7b" />
// // //                   <stop offset="100%" stopColor="#961aae" />
// // //                 </linearGradient>
// // //               </defs>
// // //             </svg>
// // //             <span className="absolute text-xl font-bold text-gray-800">
// // //               {steps} Steps
// // //             </span>
// // //           </div>
 
// // //           {/* Calories and Distance */}
// // //           <div className="ml-10 flex flex-col items-start text-gray-800">
// // //             <p className="text-2xl font-semibold">{calories} kcal</p>
// // //             <p className="text-lg">Calories Burned</p>
// // //             <p className="mt-4 text-2xl font-semibold">{distance} km</p>
// // //             <p className="text-lg">Distance Walked</p>
// // //           </div>
// // //         </div>
 
// // //         {/* Show error message if data fails to load */}
// // //         {/* {error && <div className="text-red-600 font-semibold mt-4">{error}</div>} */}
 
// // //         {/* <WeekProgress /> */}
// // //       </div>
// // //     </AppLayout>
// // //   );
// // // };
 
// // // export default StepsDisplay;
 
 
// // // import React, { useState, useEffect } from "react";
// // // import axios from "axios";
// // // import { AppLayout } from "@/components/layout/AppLayout";
// // // import WeekProgress from "./WeekProgress";
 
// // // interface StepsData {
// // //   stepsToday: number;
// // // }
 
// // // const StepsDisplay: React.FC = () => {
// // //   const [steps, setSteps] = useState<number>(0);
// // //   const [calories, setCalories] = useState<number>(0);
// // //   const [error, setError] = useState<string | null>(null);
 
// // //   useEffect(() => {
// // //     const eventSource = new EventSource("http://localhost:5000/get-steps/2");
 
// // //     eventSource.onmessage = (event: MessageEvent) => {
// // //       try {
// // //         const data: StepsData = JSON.parse(event.data);
// // //         if (data.stepsToday !== undefined) {
// // //           setSteps(data.stepsToday);
// // //           setCalories(parseFloat((data.stepsToday * 0.04).toFixed(2)));
// // //         }
// // //       } catch (err) {
// // //         setError("Error parsing data");
// // //       }
// // //     };
 
// // //     eventSource.onerror = () => {
// // //       setError("Failed to fetch steps. Ensure Google Fit is connected.");
// // //       eventSource.close();
// // //     };
 
// // //     return () => {
// // //       eventSource.close();
// // //     };
// // //   }, []);
 
// // //   return (
// // //     <AppLayout>
// // //         <div className="flex flex-col gap-8 animate-fade-in">
// // //         <div>
// // //           <h2 className="text-base font-semibold leading-7 text-primary">
// // //             Steps Tracker
// // //           </h2>
// // //           <p className="mt-1 text-3xl font-bold tracking-tight">
// // //             Keep Walking and burn your Calories!
// // //           </p>
// // //         </div>
 
       
 
// // //             <div className="flex items-center justify-center bg-white p-6 rounded-xl shadow-lg">
// // //                 {/* Circular Step Counter */}
// // //                 <div className="relative w-32 h-32 flex items-center justify-center">
// // //                     <svg className="w-full h-full">
// // //                         <circle cx="50%" cy="50%" r="48" stroke="#e0e0e0" strokeWidth="10" fill="none" />
// // //                         <circle
// // //                         cx="50%"
// // //                         cy="50%"
// // //                         r="48"
// // //                         stroke="#4caf50"
// // //                         strokeWidth="10"
// // //                         fill="none"
// // //                         strokeDasharray="300"
// // //                         strokeDashoffset={300 - (steps / 10000) * 300}
// // //                         strokeLinecap="round"
// // //                         transform="rotate(-90 64 64)"
// // //                         />
// // //                     </svg>
// // //                     <span className="absolute text-lg font-bold text-gray-800">{steps} Steps</span>
// // //                 </div>
 
// // //                 {/* Calories Burned Info */}
// // //                 <div className="ml-6">
// // //                     <p className="text-xl font-semibold text-gray-700">{calories} kcal</p>
// // //                     <p className="text-gray-500">Calories Burned</p>
// // //                 </div>
// // //             </div>
 
// // //             {/* Show error message if data fails to load */}
// // //             {error && <div className="absolute bottom-5 text-red-600 font-semibold">{error}</div>}
// // //             </div>
         
           
 
         
 
 
// // //             <WeekProgress/>
   
// // //     </AppLayout>
// // //   );
// // // };
 
// // // export default StepsDisplay;


// import { useState, useEffect } from "react";
// import { supabase } from "../../config/supabaseClient";
// import { motion } from "framer-motion";
// import { AppLayout } from "@/components/layout/AppLayout";

// const StepsCounter = () => {
//   const [stepCount, setStepCount] = useState(0);
//   const [goal, setGoal] = useState(10000);
//   const [newGoal, setNewGoal] = useState(10000);
//   const [isCounting, setIsCounting] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [deltaValues, setDeltaValues] = useState({ x: 0, y: 0, z: 0 });

//   // Motion Detection Variables
//   const threshold = 4;
//   let lastX = 0, lastY = 0, lastZ = 0;

//   useEffect(() => {
//     getUserId();
//   }, []);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;

//     if (isCounting) {
//       window.addEventListener("devicemotion", detectMotion);
//       timer = setInterval(() => {
//         setElapsedTime((prev) => prev + 1);
//       }, 1000);
//     } else {
//       window.removeEventListener("devicemotion", detectMotion);
//       clearInterval(timer);
//     }

//     return () => {
//       window.removeEventListener("devicemotion", detectMotion);
//       clearInterval(timer);
//     };
//   }, [isCounting]);

//   // 🔹 Fetch User ID from Supabase
//   const getUserId = async () => {
//     const { data, error } = await supabase.auth.getUser();
//     if (error) {
//       console.error("Error fetching user:", error);
//       return;
//     }
//     setUserId(data?.user?.id || null);
//     if (data?.user?.id) {
//       fetchGoal(data.user.id);
//       fetchStepCount(data.user.id);
//     }
//   };

//   // 🔹 Fetch goal from Supabase
//   const fetchGoal = async (uid: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("steps")
//         .select("goal_steps")
//         .eq("user_id", uid)
//         .maybeSingle();

//       if (error) throw error;
//       if (data?.goal_steps !== undefined) {
//         setGoal(data.goal_steps);
//         setNewGoal(data.goal_steps);
//       }
//     } catch (error) {
//       console.error("Error fetching goal:", error);
//     }
//   };

//   // 🔹 Fetch step count from Supabase
//   const fetchStepCount = async (uid: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("steps")
//         .select("step_count")
//         .eq("user_id", uid)
//         .maybeSingle();

//       if (error) throw error;
//       if (data?.step_count !== undefined) {
//         setStepCount(data.step_count);
//       }
//     } catch (error) {
//       console.error("Error fetching step count:", error);
//     }
//   };

//   // 🔹 Update step count in Supabase
//   const updateStepCount = async (steps: number) => {
//     if (!userId) return;

//     try {
//       const { error } = await supabase
//         .from("steps")
//         .upsert([{ user_id: userId, step_count: steps }], { onConflict: "user_id" });

//       if (error) throw error;
//     } catch (error) {
//       console.error("Error updating step count:", error);
//     }
//   };

//   // 🔹 Update goal in Supabase
//   const updateGoal = async () => {
//     if (!userId) return;

//     try {
//       const { error } = await supabase
//         .from("steps")
//         .upsert([{ user_id: userId, goal_steps: newGoal }], { onConflict: "user_id" });

//       if (error) throw error;
//       setGoal(newGoal);
//     } catch (error) {
//       console.error("Error updating goal:", error);
//     }
//   };

//   // 🔹 Detect Motion and Count Steps
//   const detectMotion = (event: DeviceMotionEvent) => {
//     if (!isCounting) return;

//     let { x = 0, y = 0, z = 0 } = event.acceleration ?? {};

//     let deltaX = Math.abs(x - lastX);
//     let deltaY = Math.abs(y - lastY);
//     let deltaZ = Math.abs(z - lastZ);

//     setDeltaValues({ x: deltaX, y: deltaY, z: deltaZ });

//     if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
//       setStepCount((prev) => {
//         const newStepCount = prev + 1;
//         updateStepCount(newStepCount);
//         return newStepCount;
//       });
//     }

//     lastX = x;
//     lastY = y;
//     lastZ = z;
//   };

//   // 🔹 Start Counting (Fix: Keeps saved step count)
//   const startCounting = () => {
//     setElapsedTime(0);
//     setIsCounting(true);
//   };

//   // 🔹 Stop Counting
//   const stopCounting = () => {
//     setIsCounting(false);
//   };

//   const progress = Math.min((stepCount / goal) * 100, 100);

//   return (
//    <AppLayout>
//     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#351289] to-[#6E17A0] text-white p-4 ">
//       <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-6 text-center">
//         <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">Step Counter</h1>

//         {/* Step Goal Input */}
//         <div className="mb-6">
//           <label className="block text-lg font-semibold mb-2 text-black">Set Your Goal</label>
//           <input
//             type="number"
//             className="w-full p-2 border-none rounded-lg text-black bg-gray-100 focus:outline-none"
//             value={newGoal}
//             onChange={(e) => setNewGoal(Number(e.target.value))}
//             placeholder="Enter step goal"
//           />
//           <button
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//             onClick={updateGoal}
//           >
//             Set Goal
//           </button>
//         </div>

//         {/* Timer & Status */}
//         <div className="mb-4 text-lg font-semibold text-black">
//           ⏱️ Time: {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? `0${elapsedTime % 60}` : elapsedTime % 60}
//         </div>
//         <div className={`mb-4 text-lg font-bold ${isCounting ? "text-green-400" : "text-red-400"}`}>
//           {isCounting ? "Recording..." : "Not Recording"}
//         </div>

//         {/* Delta Values */}
//         <div className="mb-4 bg-gray-800 p-4 rounded-lg">
//           <p>ΔX: {deltaValues.x.toFixed(2)}</p>
//           <p>ΔY: {deltaValues.y.toFixed(2)}</p>
//           <p>ΔZ: {deltaValues.z.toFixed(2)}</p>
//         </div>

//         {/* Circular Progress Bar */}
//         <div className="relative w-40 h-40 mx-auto mb-6">
//           <svg className="absolute top-0 left-0 w-full h-full">
//             <circle cx="50%" cy="50%" r="70" stroke="#ddd" strokeWidth="10" fill="none" />
//             <motion.circle
//               cx="50%"
//               cy="50%"
//               r="70"
//               stroke="#4CAF50"
//               strokeWidth="10"
//               fill="none"
//               strokeDasharray="283"
//               strokeDashoffset={283 - (progress / 100) * 283}
//               initial={{ strokeDashoffset: 283 }}
//               animate={{ strokeDashoffset: 283 - (progress / 100) * 283 }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-black">
//             {stepCount} / {goal} Steps
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex space-x-4 justify-center">
//           <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={startCounting}>
//             Start
//           </button>
//           <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={stopCounting}>
//             Stop
//           </button>
//         </div>
//       </div>
//     </div>
//     </AppLayout>
//   );
// };

// export default StepsCounter;


