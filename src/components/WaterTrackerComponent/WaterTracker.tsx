// import React, { useState } from "react";
// import BigCup from "./BigCup";
// import SmallCups from "./SmallCups";
// import Message from "./Message";
// import "../../css_files/WaterTracker.css";

// const WaterTracker = () => {
//   const [userGoal, setUserGoal] = useState(8);
//   const [defaultGoal, setDefaultGoal] = useState(8);
//   const [currentValue, setCurrentValue] = useState(0);

//   const onSubmitUserGoal = (e) => {
//     e.preventDefault();
//     setDefaultGoal(userGoal);
//   };

//   const onChangeUserGoal = (event) => {
//     setUserGoal(parseInt(event.target.value) || 0);
//   };

//   const handleChange = (value) => {
//     setCurrentValue(parseInt(currentValue + value) || 0);
//   };

//   return (
//     <div className="body">
//       <div className="main-wrapper body">
//         <h3 className="title">How many cups do you want to drink?</h3>
//         <form className="form" onSubmit={onSubmitUserGoal}>
//           <label className="goal-label">
//             Your goal:
//             <input
//               type="number"
//               min="1"
//               max="15"
//               value={userGoal}
//               onChange={onChangeUserGoal}
//               className="input1 text-black w-[40px]"
//             />
//           </label>
//           <button className="btn" type="submit">
//             Submit
//           </button>
//         </form>
//         <Message goal={defaultGoal} currentValue={currentValue} />
//         <div className="cups-wrapper">
//           <BigCup goal={defaultGoal} currentValue={currentValue} />
//           <SmallCups goal={defaultGoal} handleChange={handleChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTracker;

// import React, { useEffect, useState } from "react";
// import BigCup from "./BigCup";
// import SmallCups from "./SmallCups";
// import Message from "./Message";
// import { supabase } from "../../config/supabaseClient";
// import "../../css_files/WaterTracker.css";

// const WaterTracker = () => {
//   const [userGoal, setUserGoal] = useState(8);
//   const [defaultGoal, setDefaultGoal] = useState(8);
//   const [currentValue, setCurrentValue] = useState(0);
//   const [userId, setUserId] = useState(null);

//   // Fetch user and water data
//   useEffect(() => {
//     const fetchUserAndWaterData = async () => {
//       const { data: user, error: userError } = await supabase.auth.getUser();
//       if (userError || !user?.user) return console.error("Error fetching user:", userError);

//       const uid = user.user.id;
//       setUserId(uid);

//       const { data, error } = await supabase
//         .from("water_tracker")
//         .select("*")
//         .eq("user_id", uid)
//         .single();

//       if (error && error.code !== "PGRST116") {
//         console.error("Error fetching water data:", error);
//       } else if (data) {
//         setCurrentValue(data.water_intake);
//         setDefaultGoal(data.water_target);
//       } else {
//         // Insert default entry if no record exists
//         await supabase.from("water_tracker").insert([{ user_id: uid, water_intake: 0, water_target: 2000 }]);
//       }
//     };

//     fetchUserAndWaterData();
//   }, []);

//   const onSubmitUserGoal = async (e) => {
//     e.preventDefault();
//     setDefaultGoal(userGoal);

//     if (!userId) return;
//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_target: userGoal * 250 }) // Convert cups to milliliters
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water target:", error);
//   };

//   const onChangeUserGoal = (event) => {
//     setUserGoal(parseInt(event.target.value) || 0);
//   };

//   const handleChange = async (value) => {
//     const newWaterIntake = Math.max(0, currentValue + value * 250); // Convert cups to milliliters
//     setCurrentValue(newWaterIntake);

//     if (!userId) return;
//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_intake: newWaterIntake })
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water intake:", error);
//   };

//   return (
//     <div className="body">
//       <div className="main-wrapper body">
//         <h3 className="title">How many cups do you want to drink?</h3>
//         <form className="form" onSubmit={onSubmitUserGoal}>
//           <label className="goal-label">
//             Your goal:
//             <input
//               type="number"
//               min="1"
//               max="15"
//               value={userGoal}
//               onChange={onChangeUserGoal}
//               className="input1 text-black w-[40px]"
//             />
//           </label>
//           <button className="btn" type="submit">
//             Submit
//           </button>
//         </form>
//         <Message goal={defaultGoal / 250} currentValue={currentValue / 250} />
//         <div className="cups-wrapper">
//           <BigCup goal={defaultGoal / 250} currentValue={currentValue / 250} />
//           <SmallCups goal={defaultGoal / 250} handleChange={handleChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTracker;


// import React, { useEffect, useState } from "react";
// import BigCup from "./BigCup";
// import SmallCups from "./SmallCups";
// import Message from "./Message";
// import { supabase } from "../../config/supabaseClient";
// import "../../css_files/WaterTracker.css";

// const CUP_SIZE_LITERS = 0.25; // 250mL per cup

// const WaterTracker = () => {
//   const [userGoal, setUserGoal] = useState(2); // Default goal in Liters
//   const [defaultGoal, setDefaultGoal] = useState(2);
//   const [currentValue, setCurrentValue] = useState(0);
//   const [userId, setUserId] = useState(null);

//   // Fetch user and water data
//   useEffect(() => {
//     const fetchUserAndWaterData = async () => {
//       const { data: user, error: userError } = await supabase.auth.getUser();
//       if (userError || !user?.user) return console.error("Error fetching user:", userError);

//       const uid = user.user.id;
//       setUserId(uid);

//       const { data, error } = await supabase
//         .from("water_tracker")
//         .select("*")
//         .eq("user_id", uid)
//         .single();

//       if (error && error.code !== "PGRST116") {
//         console.error("Error fetching water data:", error);
//       } else if (data) {
//         setCurrentValue(data.water_intake / 1000); // Convert mL to L
//         setDefaultGoal(data.water_target / 1000); // Convert mL to L
//       } else {
//         // Insert default entry if no record exists (convert L to mL)
//         await supabase.from("water_tracker").insert([{ user_id: uid, water_intake: 0, water_target: 2000 }]);
//       }
//     };

//     fetchUserAndWaterData();
//   }, []);

//   const onSubmitUserGoal = async (e) => {
//     e.preventDefault();
//     setDefaultGoal(userGoal);

//     if (!userId) return;
//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_target: userGoal * 1000 }) // Convert L to mL before storing
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water target:", error);
//   };

//   const onChangeUserGoal = (event) => {
//     setUserGoal(parseFloat(event.target.value) || 0);
//   };

//   const handleChange = async (value) => {
//     const newWaterIntake = Math.max(0, currentValue + value * CUP_SIZE_LITERS); // Each cup = 0.25L
//     setCurrentValue(newWaterIntake);

//     if (!userId) return;
//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_intake: newWaterIntake * 1000 }) // Convert L to mL before storing
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water intake:", error);
//   };

//   return (
//     <div className="body">
//       <div className="main-wrapper body">
//         <h3 className="title">How many liters do you want to drink?</h3>
//         <form className="form" onSubmit={onSubmitUserGoal}>
//           <label className="goal-label">
//             Your goal (L):
//             <input
//               type="number"
//               min="0.5"
//               max="5"
//               step="0.1"
//               value={userGoal}
//               onChange={onChangeUserGoal}
//               className="input1 text-black w-[50px]"
//             />
//           </label>
//           <button className="btn" type="submit">
//             Submit
//           </button>
//         </form>

//         {/* Convert Liters to Cups (L / 0.25) */}
//         <Message goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
        
//         <div className="cups-wrapper">
//           <BigCup goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
//           <SmallCups goal={defaultGoal / CUP_SIZE_LITERS} handleChange={handleChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTracker;


// import React, { useEffect, useState } from "react";
// import BigCup from "./BigCup";
// import SmallCups from "./SmallCups";
// import Message from "./Message";
// import { supabase } from "../../config/supabaseClient";
// import "../../css_files/WaterTracker.css";

// const CUP_SIZE_LITERS = 0.25; // Each small cup = 250mL (0.25L)

// const WaterTracker = () => {
//   const [userGoal, setUserGoal] = useState(2); // Default goal in Liters
//   const [defaultGoal, setDefaultGoal] = useState(2);
//   const [currentValue, setCurrentValue] = useState(0);
//   const [userId, setUserId] = useState(null);

//   // Fetch user and water intake data
//   useEffect(() => {
//     const fetchUserAndWaterData = async () => {
//       const { data: authUser, error: userError } = await supabase.auth.getUser();
//       if (userError || !authUser?.user) {
//         console.error("Error fetching user:", userError);
//         return;
//       }

//       const uid = authUser.user.id;
//       setUserId(uid);

//       const { data, error } = await supabase
//         .from("water_tracker")
//         .select("*")
//         .eq("user_id", uid)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") {
//           // No record exists, insert a new one
//           const { error: insertError } = await supabase
//             .from("water_tracker")
//             .insert([{ user_id: uid, water_intake: 0, water_target: 2 }]);

//           if (insertError) console.error("Error inserting water data:", insertError);
//         }
//       } else {
//         // ✅ Ensure correct values are set
//         setCurrentValue(data.water_intake);
//         setDefaultGoal(data.water_target);
//       }
//     };

//     fetchUserAndWaterData();
//   }, []);

//   // Update user goal in DB
//   const onSubmitUserGoal = async (e) => {
//     e.preventDefault();
//     setDefaultGoal(userGoal);

//     if (!userId) return;
//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_target: userGoal })
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water target:", error);
//   };

//   const onChangeUserGoal = (event) => {
//     setUserGoal(parseFloat(event.target.value) || 0);
//   };

//   // Update water intake when clicking small cups
//   const handleChange = async (value) => {
//     const newWaterIntake = Math.max(0, currentValue + value * CUP_SIZE_LITERS);
//     setCurrentValue(newWaterIntake);

//     if (!userId) return;

//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_intake: newWaterIntake })
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water intake:", error);
//   };

//   return (
//     <div className="body">
//       <div className="main-wrapper body">
//         <h3 className="title">How many liters do you want to drink?</h3>
//         <form className="form" onSubmit={onSubmitUserGoal}>
//           <label className="goal-label">
//             Your goal (L):
//             <input
//               type="number"
//               min="0.5"
//               max="5"
//               step="0.1"
//               value={userGoal}
//               onChange={onChangeUserGoal}
//               className="input1 text-black w-[50px]"
//             />
//           </label>
//           <button className="btn" type="submit">
//             Submit
//           </button>
//         </form>

//         {/* Convert Liters to Cups */}
//         <Message goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />

//         <div className="cups-wrapper">
//           <BigCup goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
//           <SmallCups goal={defaultGoal / CUP_SIZE_LITERS} handleChange={handleChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTracker;

// import React, { useEffect, useState } from "react";
// import BigCup from "./BigCup";
// import SmallCups from "./SmallCups";
// import Message from "./Message";
// import { supabase } from "../../config/supabaseClient";
// import "../../css_files/WaterTracker.css";

// const CUP_SIZE_LITERS = 0.25; // 250mL per cup

// const WaterTracker = () => {
//   const [userGoal, setUserGoal] = useState(2);
//   const [defaultGoal, setDefaultGoal] = useState(2);
//   const [currentValue, setCurrentValue] = useState(0);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserAndWaterData = async () => {
//       const { data: authUser, error: userError } = await supabase.auth.getUser();
//       if (userError || !authUser?.user) {
//         console.error("Error fetching user:", userError);
//         return;
//       }
  
//       const uid = authUser.user.id;
//       setUserId(uid);
  
//       const { data, error } = await supabase
//         .from("water_tracker")
//         .select("*")
//         .eq("user_id", uid)
//         .single();
  
//       if (error) {
//         if (error.code === "PGRST116") {
//           // No record exists, insert a new one
//           const { error: insertError } = await supabase
//             .from("water_tracker")
//             .insert([{ user_id: uid, water_intake: 0, water_target: 2 }]);
  
//           if (insertError) console.error("Error inserting water data:", insertError);
//         }
//       } else {
//         // ✅ Convert stored Liters correctly for UI
//         setCurrentValue(data.water_intake); 
//         setDefaultGoal(data.water_target);
//       }
//     };
  
//     fetchUserAndWaterData();
//   }, []);
  

//   const onSubmitUserGoal = async (e) => {
//     e.preventDefault();
//     setDefaultGoal(userGoal);

//     if (!userId) return;
//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_target: userGoal })
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water target:", error);
//   };

//   const onChangeUserGoal = (event) => {
//     setUserGoal(parseFloat(event.target.value) || 0);
//   };

//   const handleChange = async (value) => {
//     const newWaterIntake = Math.max(0, currentValue + value * CUP_SIZE_LITERS);
//     setCurrentValue(newWaterIntake);

//     if (!userId) return;

//     const { error } = await supabase
//       .from("water_tracker")
//       .update({ water_intake: newWaterIntake }) // ✅ Update without resetting
//       .eq("user_id", userId);

//     if (error) console.error("Error updating water intake:", error);
//   };

//   return (
//     <div className="body">
//       <div className="main-wrapper body">
//         <h3 className="title">How many liters do you want to drink?</h3>
//         <form className="form" onSubmit={onSubmitUserGoal}>
//           <label className="goal-label">
//             Your goal (L):
//             <input
//               type="number"
//               min="0.5"
//               max="5"
//               step="0.1"
//               value={userGoal}
//               onChange={onChangeUserGoal}
//               className="input1 text-black w-[50px]"
//             />
//           </label>
//           <button className="btn" type="submit">
//             Submit
//           </button>
//         </form>

//         <Message goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
        
//         <div className="cups-wrapper">
//           <BigCup goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
//           <SmallCups goal={defaultGoal / CUP_SIZE_LITERS} handleChange={handleChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTracker;

// import React, { useEffect, useState } from "react";
// import BigCup from "./BigCup";
// import Message from "./Message";
// import { supabase } from "../../config/supabaseClient";
// import "../../css_files/WaterTracker.css";

// const CUP_SIZE_LITERS = 0.25; // 250mL per cup

// const WaterTracker = () => {
//   const [userGoal, setUserGoal] = useState(2);
//   const [defaultGoal, setDefaultGoal] = useState(2);
//   const [currentValue, setCurrentValue] = useState(0);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const fetchUserAndWaterData = async () => {
//       const { data: authUser, error: userError } = await supabase.auth.getUser();
//       if (userError || !authUser?.user) {
//         console.error("Error fetching user:", userError);
//         return;
//       }
  
//       const uid = authUser.user.id;
//       setUserId(uid);
  
//       const { data, error } = await supabase
//         .from("water_tracker")
//         .select("*")
//         .eq("user_id", uid)
//         .single();
  
//       if (error) {
//         if (error.code === "PGRST116") {
//           // No record exists, insert a new one
//           const { data: newData, error: insertError } = await supabase
//             .from("water_tracker")
//             .insert([{ user_id: uid, water_intake: 0, water_target: 2 }])
//             .select()
//             .single();
  
//           if (insertError) console.error("Error inserting water data:", insertError);
//           else {
//             setCurrentValue(newData.water_intake);
//             setDefaultGoal(newData.water_target);
//           }
//         }
//       } else {
//         setCurrentValue(data.water_intake);
//         setDefaultGoal(data.water_target);
//       }
//     };
  
//     fetchUserAndWaterData();
//   }, []);
  

//   const onSubmitUserGoal = async (e) => {
//     e.preventDefault();
//     setDefaultGoal(userGoal);

//     if (!userId) return;
//     const { data, error } = await supabase
//       .from("water_tracker")
//       .update({ water_target: userGoal })
//       .eq("user_id", userId)
//       .select()
//       .single();

//     if (error) console.error("Error updating water target:", error);
//     else setDefaultGoal(data.water_target);
//   };

//   const onChangeUserGoal = (event) => {
//     setUserGoal(parseFloat(event.target.value) || 0);
//   };

//   const handleChange = async () => {
//     const newWaterIntake = Math.max(0, currentValue + CUP_SIZE_LITERS);
//     if (!userId) return;

//     const { data, error } = await supabase
//       .from("water_tracker")
//       .update({ water_intake: newWaterIntake })
//       .eq("user_id", userId)
//       .select()
//       .single();

//     if (error) console.error("Error updating water intake:", error);
//     else setCurrentValue(data.water_intake);
//   };

//   return (
//     <div className="body">
//       <div className="main-wrapper body">
//         <h3 className="title">How many liters do you want to drink?</h3>
//         <form className="form" onSubmit={onSubmitUserGoal}>
//           <label className="goal-label">
//             Your goal (L):
//             <input
//               type="number"
//               min="0.5"
//               max="5"
//               step="0.1"
//               value={userGoal}
//               onChange={onChangeUserGoal}
//               className="input1 text-black w-[50px]"
//             />
//           </label>
//           <button className="btn" type="submit">
//             Submit
//           </button>
//         </form>

//         <Message goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
        
//         <div className="cups-wrapper">
//           <BigCup goal={defaultGoal / CUP_SIZE_LITERS} currentValue={currentValue / CUP_SIZE_LITERS} />
//           <button className="btn mt-4" onClick={handleChange}>+250ml</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTracker;

// import React, { useState } from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
 
// const WaterTracker = () => {
//   const [goal, setGoal] = useState(2000); // Daily goal in ml
//   const [intake, setIntake] = useState(0);
//   const [amount, setAmount] = useState(250); // Default drink amount
 
//   const percentage = Math.min((intake / goal) * 100, 100);
 
//   const handleAddWater = () => {
//     setIntake((prev) => Math.min(prev + amount, goal));
//   };
 
//   const handleReset = () => {
//     setIntake(0);
//   };
 
//   return (
//     <div style={styles.container}>
//       <h2>🚰 Water Tracker</h2>
      
//       {/* Goal Input */}
//       <div>
//         <label>Set Goal (ml): </label>
//         <input
//           type="number"
//           value={goal}
//           onChange={(e) => setGoal(Number(e.target.value))}
//           style={styles.input}
//         />
//       </div>
 
//       {/* Water Glass Animation */}
//       <div style={styles.glassContainer}>
//         <div
//           style={{
//             ...styles.water,
//             height: `${percentage}%`,
//           }}
//         />
//       </div>
 
//       {/* Circular Progress Bar */}
//       <div style={{ width: "150px", margin: "20px auto" }}>
//         <CircularProgressbar
//           value={percentage}
//           text={`${Math.round(percentage)}%`}
//           styles={buildStyles({
//             textSize: "16px",
//             pathColor: "#00A6FF",
//             textColor: "#333",
//             trailColor: "#ddd",
//           })}
//         />
//       </div>
 
//       <p>
//         <strong>{intake} ml</strong> / {goal} ml
//       </p>
 
//       {/* Buttons */}
//       <button style={styles.button} onClick={handleAddWater}>
//         💧 Drink {amount}ml
//       </button>
//       <button style={styles.resetButton} onClick={handleReset}>
//         🔄 Reset
//       </button>
//     </div>
//   );
// };
 
// const styles = {
//   container: {
//     width: "300px",
//     margin: "auto",
//     padding: "20px",
//     textAlign: "center",
//     border: "2px solid #00A6FF",
//     borderRadius: "15px",
//     backgroundColor: "#f0f9ff",
//     boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//   },
//   input: {
//     padding: "5px",
//     fontSize: "16px",
//     width: "80px",
//     textAlign: "center",
//     marginLeft: "10px",
//   },
//   glassContainer: {
//     width: "100px",
//     height: "150px",
//     borderRadius: "10px",
//     backgroundColor: "#ddd",
//     position: "relative",
//     overflow: "hidden",
//     margin: "20px auto",
//     border: "2px solid #777",
//   },
//   water: {
//     position: "absolute",
//     bottom: "0",
//     width: "100%",
//     backgroundColor: "#00A6FF",
//     transition: "height 0.5s ease-in-out",
//   },
//   button: {
//     backgroundColor: "#00A6FF",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
//   resetButton: {
//     backgroundColor: "#FF4D4D",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     marginTop: "10px",
//     marginLeft: "10px",
//   },
// };
 
// export default WaterTracker;

// import React, { useState, useEffect } from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import {supabase} from '../../config/supabaseClient'; // Import your Supabase client

// const WaterTracker = () => {
//   const [goal, setGoal] = useState(2000); // Default goal
//   const [intake, setIntake] = useState(0); // Default intake
//   const [amount, setAmount] = useState(250); // Default drink amount
//   const [userData, setUserData] = useState(null); // Store the user's data

//   // Fetch user data when component loads
//   useEffect(() => {
//     const fetchData = async () => {
//       const user = supabase.auth.user(); // Get the current logged-in user
//       if (user) {
//         // Fetch data from Supabase for the authenticated user
//         const { data, error } = await supabase
//           .from('water_tracker')
//           .select('*')
//           .eq('user_id', user.id)
//           .single(); // Get a single record for the user

//         if (data) {
//           setGoal(data.goal); // Set goal from fetched data
//           setIntake(data.intake); // Set intake from fetched data
//           setAmount(data.amount); // Set amount from fetched data
//         } else {
//           console.error('Error fetching user data:', error);
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   const percentage = Math.min((intake / goal) * 100, 100);

//   // Handle adding water (update intake in Supabase)
//   const handleAddWater = async () => {
//     const newIntake = Math.min(intake + amount, goal);
//     setIntake(newIntake);

//     const user = supabase.auth.user();
//     if (user) {
//       const { data, error } = await supabase
//         .from('water_tracker')
//         .upsert({ user_id: user.id, intake: newIntake, goal, amount }, { onConflict: ['user_id'] });

//       if (error) {
//         console.error('Error updating intake:', error);
//       }
//     }
//   };

//   // Handle resetting intake
//   const handleReset = async () => {
//     setIntake(0);

//     const user = supabase.auth.user();
//     if (user) {
//       const { data, error } = await supabase
//         .from('water_tracker')
//         .upsert({ user_id: user.id, intake: 0, goal, amount }, { onConflict: ['user_id'] });

//       if (error) {
//         console.error('Error resetting intake:', error);
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>🚰 Water Tracker</h2>

//       <div>
//         <label>Set Goal (ml): </label>
//         <input
//           type="number"
//           value={goal}
//           onChange={(e) => setGoal(Number(e.target.value))}
//           style={styles.input}
//         />
//       </div>

//       {/* Water Glass Animation */}
//       <div style={styles.glassContainer}>
//         <div style={{ ...styles.water, height: `${percentage}%` }} />
//       </div>

//       {/* Circular Progress Bar */}
//       <div style={{ width: "150px", margin: "20px auto" }}>
//         <CircularProgressbar
//           value={percentage}
//           text={`${Math.round(percentage)}%`}
//           styles={buildStyles({
//             textSize: "16px",
//             pathColor: "#00A6FF",
//             textColor: "#333",
//             trailColor: "#ddd",
//           })}
//         />
//       </div>

//       <p>
//         <strong>{intake} ml</strong> / {goal} ml
//       </p>

//       {/* Buttons */}
//       <button style={styles.button} onClick={handleAddWater}>
//         💧 Drink {amount}ml
//       </button>
//       <button style={styles.resetButton} onClick={handleReset}>
//         🔄 Reset
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     width: "300px",
//     margin: "auto",
//     padding: "20px",
//     textAlign: "center",
//     border: "2px solid #00A6FF",
//     borderRadius: "15px",
//     backgroundColor: "#f0f9ff",
//     boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//   },
//   input: {
//     padding: "5px",
//     fontSize: "16px",
//     width: "80px",
//     textAlign: "center",
//     marginLeft: "10px",
//   },
//   glassContainer: {
//     width: "100px",
//     height: "150px",
//     borderRadius: "10px",
//     backgroundColor: "#ddd",
//     position: "relative",
//     overflow: "hidden",
//     margin: "20px auto",
//     border: "2px solid #777",
//   },
//   water: {
//     position: "absolute",
//     bottom: "0",
//     width: "100%",
//     backgroundColor: "#00A6FF",
//     transition: "height 0.5s ease-in-out",
//   },
//   button: {
//     backgroundColor: "#00A6FF",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
//   resetButton: {
//     backgroundColor: "#FF4D4D",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     marginTop: "10px",
//     marginLeft: "10px",
//   },
// };

// export default WaterTracker;
import React, { useEffect, useState } from 'react';
import BigCup from './BigCup';
import SmallCups from './SmallCups';
import Message from './Message';
import '../../css_files/WaterTracker.css';
 
const WaterTracker = () => {
  const [userGoal, setUserGoal] = useState(8);
  const [defaultGoal, setDefaultGoal] = useState(8);
  const [currentValue, setCurrentValue] = useState(0);
  const [usage, setUsage] = useState(0);
  const [goal, setGoal] = useState(0);
 
  useEffect(() => {
    const savedGoal = localStorage.getItem('userGoal');
    const savedProgress = localStorage.getItem('currentValue');
    if (savedGoal) {
      setDefaultGoal(parseInt(savedGoal));
      setUserGoal(parseInt(savedGoal));
    }
    if (savedProgress) {
      setCurrentValue(parseInt(savedProgress));
    }
 
    // Load saved cup states
    const savedCups = localStorage.getItem('selectedCups');
    if (savedCups) {
      const cups = JSON.parse(savedCups);
      const selectedCount = cups.reduce((total, count) => total + count, 0);
      setCurrentValue(selectedCount);
    }
  }, []);
 
  useEffect(() => {
    localStorage.setItem('userGoal', defaultGoal);
    localStorage.setItem('currentValue', currentValue);
  }, [defaultGoal, currentValue]);
 
  const onSubmitUserGoal = (e) => {
    e.preventDefault();
    setDefaultGoal(userGoal);
  };
 
  const onChangeUserGoal = (event) => {
    setGoal(parseInt(event.target.value) || 0);
    setUserGoal(parseInt(event.target.value) || 0);
  };
 
  const handleChange = (value) => {
    setCurrentValue(parseInt(currentValue + value) || 0);
  };
 
  return (
    <div className='body'>
      <div className='main-wrapper body'>
        <h3 className='title'>How many cups do you want to drink?</h3>
        <form className='form' onSubmit={onSubmitUserGoal}>
          <label className='goal-label'>
            Your goal:
            <input
              type="number"
              min="1"
              max="15"
              value={userGoal}
              onChange={onChangeUserGoal}
              className='input1 text-black w-[40px]'
            />
          </label>
          <button className="btn" type="submit">Submit</button>
        </form>
        <Message goal={defaultGoal} currentValue={currentValue} />
        <div className='cups-wrapper'>
          <BigCup goal={defaultGoal} currentValue={currentValue} />
          <SmallCups goal={defaultGoal} handleChange={handleChange} />
        </div>
      </div>
    </div>
  );
};
 
export default WaterTracker;