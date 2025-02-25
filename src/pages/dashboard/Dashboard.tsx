// import React from "react";
// import Sleep from "@/components/SleepComponent/Sleep";
// import WaterTracker from "@/components/WaterTrackerComponent/WaterTracker";
// import { Sidebar } from "@/components/layout/Sidebar";
// import { AppLayout } from "@/components/layout/AppLayout";

// export default function Dashboard() {
//   return (
//     <>
//       <AppLayout>
//         <main className="flex flex-col gap-4 mt-5">
//           {/* Grid Container */}
//           <div className="grid grid-cols-2 gap-3 bg-gray-200 p-4 rounded-lg">
//             <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
//               Your BMI
//             </div>
//             <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
//               Steps taken
//             </div>
//             <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
//               Water Intake
//             </div>
//             <div className="bg-white rounded-lg text-center font-bold text-gray-800 shadow-md">
//             <Sleep />
              
//             </div>
//           </div>
          
//           {/* <WaterTracker /> */}
//         </main>
//       </AppLayout>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import Sleep from "@/components/SleepComponent/Sleep";
import { supabase } from "../../config/supabaseClient";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [bmi, setBmi] = useState<number | string | null>()
  const [caloriesBurned, setCaloriesBurned] = useState<number[]>([])

  useEffect(() => {
    const fetchBMI = async () => {
      setBmi('fetching...');
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        setBmi("couldn't fetch");
        return;
      }

      // Fetch BMI record for the current user
      const { data, error } = await supabase
        .from('bmi_records')
        .select('bmi')
        .eq('user_id', user.id)
        .single();  // Assumes each user has one BMI record

      if (error) {
        setBmi("couldn't fetch");
        console.error('Error fetching BMI:', error.message);
      } else {
        setBmi(data?.bmi);
      }
      
    };
    fetchBMI();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // Fetch and calculate total calories
  useEffect(() => {
    if (user) {
      fetchTotalCalories();
    }
  }, [user, selectedDate]);

  const fetchTotalCalories = async () => {
    const { data, error } = await supabase
      .from("food_entries ") // Replace with your table name
      .select("calories")
      .eq("user_id", user.id)
      .eq("date", selectedDate);

    if (data) {
      const total = data.reduce((sum, entry) => sum + entry.calories, 0);
      setTotalCalories(total);
    } else if (error) {
      console.error("Error fetching calories:", error.message);
    }
  };
  useEffect(()=>{
    const fetchCalories = async () => {

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error fetching user:", userError?.message);
        setCaloriesBurned([]); // Set empty array if no user found
        return;
      }

      // Fetch all calories_burned for the current user
      const { data, error } = await supabase
        .from("exercises")
        .select("calories_burned") // Select only the calories_burned column
        .eq("user_id", user.id); // Filter by user ID

      if (error) {
        console.error("Error fetching calories:", error.message);
        setCaloriesBurned([]); // Set empty array on error
      } else {
        setCaloriesBurned(data.map(record => record.calories_burned)); // Extract only the values
      }

    };

    fetchCalories();
  }, [])


  return (
    <AppLayout>
      <main className="flex flex-col gap-4 mt-5">
        {/* Grid Container */}
        <div className="grid grid-cols-2 gap-3 bg-gray-200 p-4 rounded-lg">
          {/* Calories Display */}
          <div className="bg-white p-20 rounded-lg text-center font-bold text-gray-800 shadow-md">
            <p className="text-lg">Calories Consumed</p>
            <p className="text-2xl text-blue-600">{totalCalories} kcal</p>
          </div>

          <div className="bg-white p-20 rounded-lg text-center font-bold text-gray-800 shadow-md">
            <p className="text-lg">Calories burned by exercising: </p>
            <p className="text-2xl text-blue-600">{caloriesBurned.reduce((sum, value) => sum + value, 0)}</p>
            
          </div>

          <div className="bg-white p-20 rounded-lg text-center font-bold text-gray-800 shadow-md ">
            <p className="text-lg top-20">Your BMI:</p>
            <p className="text-2xl text-blue-600">{bmi}</p>
             
          </div>

          <div className="bg-white rounded-lg text-center font-bold text-gray-800 shadow-md">
            <Sleep />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
