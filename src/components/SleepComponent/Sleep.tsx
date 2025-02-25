// import { useState, useEffect } from 'react';
// import { motion } from "framer-motion";
// import '../../css_files/Sleep.css';

// const Sleep = () => {
//     const [sleepHours, setSleepHours] = useState(6);
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//     const goal = 12;

//     useEffect(() => {
//         const savedData = localStorage.getItem(selectedDate);
//         if (savedData) {
//             setSleepHours(Number(savedData));
//         }
//     }, [selectedDate]);

//     const percentage = (sleepHours / goal) * 100;

//     const changeSleepHours = (e:any) => {
//         const hours = e.target.value;
//         setSleepHours(hours);
//         localStorage.setItem(selectedDate, hours);
//     };

//     const changeDate = (e:any) => {
//         setSelectedDate(e.target.value);
//     };

//     return (
//         <div className='main'>
//             <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
//                 <div className="w-full h-full flex flex-col justify-center items-center">
//                     <h1 className="text-4xl font-bold mb-6">Sleep Tracker</h1>
                    
//                     {/* Date Picker */}
//                     <input
//                         title='date'
//                         type="date"
//                         value={selectedDate}
//                         onChange={changeDate}
//                         className="mb-4 p-2 rounded text-black"
//                     />

//                     {/* Sleep Bar */}
//                     <div className="relative w-1/3 h-64 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
//                         <motion.div
//                             className="absolute bottom-0 left-0 right-0 bg-blue-500"
//                             initial={{ height: "0%" }}
//                             animate={{ height: `${percentage}%` }}
//                             transition={{ duration: 1.5, ease: "easeInOut" }}
//                         />
//                         <motion.div
//                             className="absolute w-full text-lg font-bold text-white flex justify-center items-center h-full"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 1, duration: 1 }}
//                         >
//                             {sleepHours} hrs / {goal} hrs
//                         </motion.div>
//                     </div>

//                     {/* Range Slider */}
//                     <input
//                         title='range'
//                         type="range"
//                         min="0"
//                         max="12"
//                         step="0.5"
//                         value={sleepHours}
//                         onChange={changeSleepHours}
//                         className="w-1/3 mt-8 cursor-pointer"
//                     />
        
//                     <p className="mt-2 text-lg">Adjust your sleep hours</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sleep;


// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { supabase } from "../../config/supabaseClient"; 
// import "../../css_files/Sleep.css";

// const Sleep = () => {
//     const [user, setUser] = useState(null);
//     const [sleepHours, setSleepHours] = useState(6);
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
//     const goal = 12;

//     // Fetch the logged-in user
//     useEffect(() => {
//         const fetchUser = async () => {
//             const { data, error } = await supabase.auth.getUser();
//             if (error) {
//                 console.error("Error fetching user:", error.message);
//             } else {
//                 setUser(data.user);
//             }
//         };
//         fetchUser();
//     }, []);

//     // Fetch sleep data when the user and selectedDate change
//     useEffect(() => {
//         if (user) {
//             fetchSleepData();
//         }
//     }, [user, selectedDate]);

//     const fetchSleepData = async () => {
//         const { data, error } = await supabase
//             .from("sleep_tracker")
//             .select("sleep_hours")
//             .eq("user_id", user.id)
//             .eq("date", selectedDate)
//             .single();

//         if (data) {
//             setSleepHours(data.sleep_hours);
//         } else if (error && error.code !== "PGRST116") { // Ignore 'no rows found' errors
//             console.error("Error fetching sleep data:", error.message);
//         }
//     };

//     const saveSleepData = async (hours) => {
//         if (!user) return;
        
//         const { error } = await supabase
//             .from("sleep_tracker")
//             .upsert([{ user_id: user.id, date: selectedDate, sleep_hours: hours }], { onConflict: ["user_id", "date"] });

//         if (error) {
//             console.error("Error saving sleep data:", error.message);
//         }
//     };

//     const changeSleepHours = (e) => {
//         const hours = parseFloat(e.target.value);
//         setSleepHours(hours);
//         saveSleepData(hours);
//     };

//     const changeDate = (e) => {
//         setSelectedDate(e.target.value);
//     };

//     const percentage = (sleepHours / goal) * 100;

//     return (
//         <div className="main">
//             <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
//                 <div className="w-full h-full flex flex-col justify-center items-center">
//                     <h1 className="text-4xl font-bold mb-6">Sleep Tracker</h1>
                    
//                     {/* Date Picker */}
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={changeDate}
//                         className="mb-4 p-2 rounded text-black"
//                     />

//                     {/* Sleep Bar */}
//                     <div className="relative w-1/3 h-64 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
//                         <motion.div
//                             className="absolute bottom-0 left-0 right-0 bg-blue-500"
//                             initial={{ height: "0%" }}
//                             animate={{ height: `${percentage}%` }}
//                             transition={{ duration: 1.5, ease: "easeInOut" }}
//                         />
//                         <motion.div
//                             className="absolute w-full text-lg font-bold text-white flex justify-center items-center h-full"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 1, duration: 1 }}
//                         >
//                             {sleepHours} hrs / {goal} hrs
//                         </motion.div>
//                     </div>

//                     {/* Range Slider */}
//                     <input
//                         type="range"
//                         min="0"
//                         max="12"
//                         step="0.5"
//                         value={sleepHours}
//                         onChange={changeSleepHours}
//                         className="w-1/3 mt-8 cursor-pointer"
//                     />
        
//                     <p className="mt-2 text-lg">Adjust your sleep hours</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sleep;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../config/supabaseClient"; 
import "../../css_files/Sleep.css";

const Sleep = () => {
    const [user, setUser] = useState(null);
    const [sleepHours, setSleepHours] = useState(6);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const goal = 12;

    // Fetch the logged-in user
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

    // Fetch sleep data when the user and selectedDate change
    useEffect(() => {
        if (user) {
            fetchSleepData();
        }
    }, [user, selectedDate]);

    const fetchSleepData = async () => {
        const { data, error } = await supabase
            .from("sleep_tracker")
            .select("sleep_hours")
            .eq("user_id", user.id)
            .eq("date", selectedDate)
            .single();

        if (data) {
            setSleepHours(data.sleep_hours);
        } else if (error && error.code !== "PGRST116") { // Ignore 'no rows found' errors
            console.error("Error fetching sleep data:", error.message);
        }
    };

    const saveSleepData = async (hours) => {
        if (!user) return;
        
        const { error } = await supabase
            .from("sleep_tracker")
            .upsert([{ user_id: user.id, date: selectedDate, sleep_hours: hours }], { onConflict: ["user_id", "date"] });

        if (error) {
            console.error("Error saving sleep data:", error.message);
        }
    };

    const changeSleepHours = (e) => {
        const hours = parseFloat(e.target.value);
        setSleepHours(hours);
        saveSleepData(hours);
    };

    const changeDate = (e) => {
        setSelectedDate(e.target.value);
    };

    const percentage = (sleepHours / goal) * 100;

    return (
        <div className="flex flex-col p-10 justify-between items-center bg-white rounded-lg shadow-md w-full h-full">
            <h2 className="text-xl font-semibold text-gray-800">Sleep Tracker</h2>

            {/* Date Picker */}
            <input
                type="date"
                value={selectedDate}
                onChange={changeDate}
                className="p-1 rounded border border-gray-300 text-black"
            />

            {/* Sleep Progress Bar */}
            <div className="relative w-full h-10 bg-gray-300 rounded-lg overflow-hidden shadow-inner mt-2">
                <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
                    {sleepHours} hrs / {goal} hrs
                </div>
            </div>

            {/* Range Slider */}
            <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={changeSleepHours}
                className="w-full mt-2 cursor-pointer"
            />
        </div>
    );
};

export default Sleep;
