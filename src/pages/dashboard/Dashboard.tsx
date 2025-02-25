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

  // Fetch logged-in user
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

  return (
    <AppLayout>
      <main className="flex flex-col gap-4 mt-5">
        {/* Grid Container */}
        <div className="grid grid-cols-2 gap-3 bg-gray-200 p-4 rounded-lg">
          {/* Calories Display */}
          <div className="bg-white p-6 rounded-lg text-center font-bold text-gray-800 shadow-md">
            <p className="text-lg">Calories Consumed</p>
            <p className="text-2xl text-blue-600">{totalCalories} kcal</p>
          </div>

          <div className="bg-white p-6 rounded-lg text-center font-bold text-gray-800 shadow-md">
            Steps Taken
          </div>

          <div className="bg-white p-6 rounded-lg text-center font-bold text-gray-800 shadow-md">
            Water Intake
          </div>

          <div className="bg-white rounded-lg text-center font-bold text-gray-800 shadow-md">
            <Sleep />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
