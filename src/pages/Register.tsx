// import { useState, useEffect } from "react";
// import { supabase } from "../config/supabaseClient";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [fullName, setFullName] = useState("");
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   const [country, setCountry] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [fitnessGoal, setFitnessGoal] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: session, error } = await supabase.auth.getSession();
//       const user = session?.session?.user;

//       if (!user || error) {
//         navigate("/auth"); // Redirect to login if not authenticated
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   const handleRegister = async () => {
//     const { data: session } = await supabase.auth.getSession();
//     const user = session?.session?.user;

//     if (!user) {
//       alert("No authenticated user found");
//       return;
//     }

//     // Insert user details into Supabase
//     const { error } = await supabase.from("users").insert([
//       {
//         id: user.id,
//         email: user.email,
//         full_name: fullName,
//         age: age ? parseInt(age) : null,
//         gender,
//         country,
//         phone_number: phoneNumber,
//         fitness_goal: fitnessGoal,
//       },
//     ]);

//     if (error) {
//       alert("Error saving data: " + error.message);
//     } else {
//       alert("Registration complete!");
//       navigate("/dashboard"); // Redirect to dashboard
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#351289] to-[#6E17A0] text-white" style={{width:"100vw", height:"100vh"}}>
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
//         <h1 className="text-3xl font-bold text-green-400 mb-4">Complete Your Profile</h1>

//         <input
//           type="text"
//           placeholder="Full Name"
//           className="w-full p-2 mt-2 bg-gray-700 rounded"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//         />

//         <input
//           type="number"
//           placeholder="Age"
//           className="w-full p-2 mt-2 bg-gray-700 rounded"
//           value={age}
//           onChange={(e) => setAge(e.target.value)}
//         />

//         <select className="w-full p-2 mt-2 bg-gray-700 rounded" value={gender} onChange={(e) => setGender(e.target.value)}>
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Country"
//           className="w-full p-2 mt-2 bg-gray-700 rounded"
//           value={country}
//           onChange={(e) => setCountry(e.target.value)}
//         />

//         <input
//           type="tel"
//           placeholder="Phone Number"
//           className="w-full p-2 mt-2 bg-gray-700 rounded"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//         />

//         <select className="w-full p-2 mt-2 bg-gray-700 rounded" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
//           <option value="">Select Fitness Goal</option>
//           <option value="Weight Loss">Weight Loss</option>
//           <option value="Muscle Gain">Muscle Gain</option>
//           <option value="General Fitness">General Fitness</option>
//         </select>

//         <button onClick={handleRegister} className="w-full bg-green-500 py-2 mt-4 rounded">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

// Define types for form fields
type UserDetails = {
  fullName: string;
  age: string;
  gender: string;
  country: string;
  phoneNumber: string;
  fitnessGoal: string;
};

const Register = () => {
  const [fullName, setFullName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [fitnessGoal, setFitnessGoal] = useState<string>("");
  const [errors, setErrors] = useState<{ [key in keyof UserDetails]?: string }>({});
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

  const validateForm = (): boolean => {
    let formErrors: { [key in keyof UserDetails]?: string } = {};
    let isValid = true;

    // Full Name: Only alphabets and spaces allowed
    const namePattern = /^[A-Za-z\s]+$/;
    if (!fullName.trim() || !namePattern.test(fullName)) {
      formErrors.fullName = "Full Name is required and must only contain alphabets and spaces";
      isValid = false;
    }

    // Age: Must be a number between 10 and 100
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100) {
      formErrors.age = "Please enter a valid age between 10 and 100";
      isValid = false;
    }

    // Gender: Must be selected
    if (!gender) {
      formErrors.gender = "Gender is required";
      isValid = false;
    }

    // Country: Only alphabets and spaces allowed
    const countryPattern = /^[A-Za-z\s]+$/;
    if (!country.trim() || !countryPattern.test(country)) {
      formErrors.country = "Country is required and must only contain alphabets and spaces";
      isValid = false;
    }

    // Phone Number: Must be 10 digits
    const phonePattern = /^[0-9]{10}$/;
    if (!phoneNumber.match(phonePattern)) {
      formErrors.phoneNumber = "Phone number should be 10 digits";
      isValid = false;
    }

    // Fitness Goal: Must be selected
    if (!fitnessGoal) {
      formErrors.fitnessGoal = "Fitness goal is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#351289] to-[#6E17A0] text-white" style={{ width: "100vw", height: "100vh" }}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Complete Your Profile</h1>

        <input
          type="text"
          placeholder="Full Name"
          className={`w-full p-2 mt-2 bg-gray-700 rounded ${errors.fullName ? "border-2 border-red-500" : ""}`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

        <input
          type="number"
          placeholder="Age"
          className={`w-full p-2 mt-2 bg-gray-700 rounded ${errors.age ? "border-2 border-red-500" : ""}`}
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}

        <select
          className={`w-full p-2 mt-2 bg-gray-700 rounded ${errors.gender ? "border-2 border-red-500" : ""}`}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

        <input
          type="text"
          placeholder="Country"
          className={`w-full p-2 mt-2 bg-gray-700 rounded ${errors.country ? "border-2 border-red-500" : ""}`}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

        <input
          type="tel"
          placeholder="Phone Number"
          className={`w-full p-2 mt-2 bg-gray-700 rounded ${errors.phoneNumber ? "border-2 border-red-500" : ""}`}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

        <select
          className={`w-full p-2 mt-2 bg-gray-700 rounded ${errors.fitnessGoal ? "border-2 border-red-500" : ""}`}
          value={fitnessGoal}
          onChange={(e) => setFitnessGoal(e.target.value)}
        >
          <option value="">Select Fitness Goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="General Fitness">General Fitness</option>
        </select>
        {errors.fitnessGoal && <p className="text-red-500 text-sm">{errors.fitnessGoal}</p>}

        <button onClick={handleRegister} className="w-full bg-green-500 py-2 mt-4 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Register;
