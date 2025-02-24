import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user || error) {
        navigate("/auth"); // Redirect to login if not authenticated
      }
    };
    fetchUser();
  }, [navigate]);

  const handleRegister = async () => {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
      alert("No authenticated user found");
      return;
    }

    // Insert user details into Supabase
    const { error } = await supabase.from("users").insert([
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
        age: age ? parseInt(age) : null,
        gender,
        country,
        phone_number: phoneNumber,
        fitness_goal: fitnessGoal,
      },
    ]);

    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      alert("Registration complete!");
      navigate("/dashboard"); // Redirect to dashboard
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white" style={{width:"100vw", height:"100vh"}}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Complete Your Profile</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mt-2 bg-gray-700 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          className="w-full p-2 mt-2 bg-gray-700 rounded"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select className="w-full p-2 mt-2 bg-gray-700 rounded" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Country"
          className="w-full p-2 mt-2 bg-gray-700 rounded"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 mt-2 bg-gray-700 rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <select className="w-full p-2 mt-2 bg-gray-700 rounded" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
          <option value="">Select Fitness Goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="General Fitness">General Fitness</option>
        </select>

        <button onClick={handleRegister} className="w-full bg-green-500 py-2 mt-4 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Register;
