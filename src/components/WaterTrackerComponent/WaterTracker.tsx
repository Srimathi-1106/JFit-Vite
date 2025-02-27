import React, { useEffect, useState } from "react";
import BigCup from "./BigCup";
import SmallCups from "./SmallCups";
import Message from "./Message";
import { supabase } from "../../config/supabaseClient";
import "../../css_files/WaterTracker.css";

const WaterTracker = () => {
  const [userId, setUserId] = useState(null);
  const [userGoal, setUserGoal] = useState(8);
  const [currentValue, setCurrentValue] = useState(0);
  const [selectedCups, setSelectedCups] = useState([]);

  useEffect(() => {
    fetchUserId();
  }, []);


  useEffect(() => {
    if (userId) {
      saveWaterTrackerData();
    }
  }, [currentValue, selectedCups]); 
 
  const fetchUserId = async () => {
    console.log("Before   kllesnlsndfklnlnsd")
    const { data, error } = await supabase.auth.getUser();
    console.log("After..............................")
    if (error) {
      console.error("Error fetching user:");
      return;
    }
    setUserId(data?.user?.id || null);  
    console.log(userId)
    if (data?.user?.id) {
      console.log(data.user.id)
      fetchWaterTrackerData(data.user.id);
    }
  };


  const fetchWaterTrackerData = async (userId) => {
    console.log("Trying to retrieve")
    const { data, error } = await supabase
      .from("water_tracker")
      .select("*")
      .eq("user_id", userId)
      .single();
    console.log("it is successfull query execution  ")

    if (error && error.code !== "PGRST116") {
      console.log("Error fetching data:");
      return;
    }

    if (data) {
      console.log("data is printing",data)
      setUserGoal(data.user_goal);
      setCurrentValue(data.current_value);
      setSelectedCups(data.selected_cups || []);
    }
  };


  const saveWaterTrackerData = async (updatedValue = currentValue, updatedCups = selectedCups) => {
    if (!userId) return;
  
    const { data: existingData } = await supabase
      .from("water_tracker")
      .select("id")
      .eq("user_id", userId)
      .single();
  
    if (existingData) {
      await supabase
        .from("water_tracker")
        .update({
          user_goal: userGoal,
          current_value: updatedValue, 
          selected_cups: updatedCups, 
        })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("water_tracker")
        .insert([
          {
            user_id: userId,
            user_goal: userGoal,
            current_value: updatedValue, 
            selected_cups: updatedCups,  
          },
        ]);
    }
  };
  
  

  
  const onChangeUserGoal = (event) => {
    
    const goalValue = parseInt(event.target.value) || 0;

    setUserGoal(goalValue); 
    
    setCurrentValue((prevValue) => {
      return prevValue > goalValue ? goalValue : prevValue;
    });

  setSelectedCups((prevCups) => {
    return prevCups.slice(0, goalValue);
  });
  
  };

  // Handle goal submission
  const onSubmitUserGoal = (e) => {
    e.preventDefault();
  
    // Prevent overflow: Adjust currentValue if it's greater than the new goal
    let adjustedValue = currentValue;
    let adjustedCups = [...selectedCups];
  
    if (currentValue > userGoal) {
      console.log("Current value is greater than the user value")
      adjustedValue = userGoal;
      adjustedCups = selectedCups.slice(0, userGoal);
    }
  
    setCurrentValue(adjustedValue);
    setSelectedCups(adjustedCups);
    
    saveWaterTrackerData(adjustedValue, adjustedCups);
  };
  

  // Handle water intake update
  const handleChange = (value, index) => {
    setCurrentValue((prevValue) => {
      const updatedValue = prevValue + value;
      
      // Update selected cups state correctly
      setSelectedCups((prevCups) => {
        const updatedCups = [...prevCups];
        updatedCups[index] = value > 0 ? 1 : 0;
        return updatedCups;
      });
  
      return updatedValue; // Return new state value
    });
  };
  

  return (
    <div className="body py-5 my-10">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold leading-7 text-white">
          Water Tracker
        </h2>
        <p className="mt-1 text-xl sm:text-3xl text-black font-bold tracking-tight">
          Track your water level and drink more!
        </p>
      </div>
      <div className="main-wrapper body">
        <h3 className="title">How many cups do you want to drink?</h3>
        <form className="form" onSubmit={onSubmitUserGoal}>
          <label className="goal-label">
            Your goal:
            <input
              type="number"
              min="1"
              max="15"
              value={userGoal}
              onChange={onChangeUserGoal}
              className="input1 text-black w-[40px]"
            />
          </label>
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
        <Message goal={userGoal} currentValue={currentValue} />
        <div className="cups-wrapper">
          <BigCup goal={userGoal} currentValue={currentValue} />
          <SmallCups goal={userGoal} handleChange={handleChange} selectedCups={selectedCups} />
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
