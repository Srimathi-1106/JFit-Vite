// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardMedia, Box, Button, Typography, Container, TextField } from "@mui/material";
// import { AppLayout } from "@/components/layout/AppLayout";
// import App from "@/App";
// // Type Definitions
// interface Exercise {
//   id: string;
//   name: string;
//   gifUrl: string;
//   target: string;
// }
 
// const BASE_API_URL = "https://exercisedb.p.rapidapi.com";
 
// const API_HEADERS = {
//   "X-RapidAPI-Key": "2a2f8f587dmsh38516a70a23a50cp1d2eebjsnb4a41ab3c0e3", // Replace with your actual API key
//   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
// };
 
// // Diet recommendations for body parts
// const dietRecommendations: { [key: string]: string } = {
//   "back": "For a strong back, incorporate high-protein foods like lean meats, eggs, and fish. Include foods rich in vitamin C to help with recovery, such as citrus fruits and leafy greens.",
//   "cardio": "For cardio workouts, a balanced diet with complex carbs (like whole grains) is important to fuel the body. Pair with lean protein (chicken, turkey) to support muscle recovery.",
//   "chest": "For building chest muscles, focus on high-protein foods like chicken, fish, and nuts. Consider adding complex carbs like brown rice and oats for energy.",
//   "lower arms": "For strengthening the lower arms, ensure you're consuming adequate protein for muscle repair, along with healthy fats from nuts, seeds, and olive oil.",
//   "lower legs": "To build muscle in the lower legs, focus on a diet rich in lean proteins and complex carbs, like quinoa, sweet potatoes, and chicken breast.",
//   "neck": "For neck exercises, consume foods rich in protein for muscle repair (like chicken and fish) and anti-inflammatory foods like turmeric and berries.",
//   "shoulders": "Build shoulder strength with a diet including lean protein sources like fish and chicken, and add a lot of vegetables for nutrients.",
//   "upper arms": "To target the upper arms, focus on protein-rich foods like turkey, tofu, and beans. Avoid sugary snacks and stick to healthy fats.",
//   "upper legs": "For leg muscle development, focus on lean protein sources and carbs like brown rice, oats, and sweet potatoes to fuel your workout.",
//   "waist": "For a slim waistline, focus on a balanced diet with high-fiber vegetables, lean proteins, and whole grains. Keep refined sugars and processed foods to a minimum."
// };
 
// const FitnessExercises = () => {
//   const [exercises, setExercises] = useState<Exercise[]>([]);
//   const [bodyParts, setBodyParts] = useState<string[]>([]);
//   const [selectedBodyPart, setSelectedBodyPart] = useState("");
//   const [reps, setReps] = useState<{ [key: string]: number }>({});
//   const [caloriesBurned, setCaloriesBurned] = useState<{ [key: string]: number }>({});
 
//   // Fetch available body parts on component mount
//   useEffect(() => {
//     const fetchBodyParts = async () => {
//       try {
//         const response = await axios.get<string[]>(`${BASE_API_URL}/exercises/bodyPartList`, { headers: API_HEADERS });
//         setBodyParts(response.data);
//       } catch (error) {
//         console.error("Error fetching body parts:", error);
//       }
//     };
 
//     fetchBodyParts();
//   }, []);
 
//   // Fetch exercises when a body part is selected
//   useEffect(() => {
//     if (selectedBodyPart) {
//       fetchExercisesByBodyPart(selectedBodyPart);
//     }
//   }, [selectedBodyPart]);
 
//   const fetchExercisesByBodyPart = async (bodyPart: string) => {
//     try {
//       const response = await axios.get<Exercise[]>(`${BASE_API_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}`, { headers: API_HEADERS });
//       setExercises(response.data);
//     } catch (error) {
//       console.error("Error fetching exercises:", error);
//     }
//   };
 
//   // Function to calculate calories burned per exercise
//   const calculateCalories = (exerciseId: string, numReps: number) => {
//     // Example: Assuming 0.05 calories burned per rep (adjust this number based on actual data)
//     const calories = numReps * 0.05;
//     setCaloriesBurned((prev) => ({
//       ...prev,
//       [exerciseId]: calories
//     }));
//   };
 
//   return (
//    <>
//    <AppLayout>
//     <Container>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Fitness Exercise Library
//       </Typography>
 
//       {/* Body Parts Section */}
//       <Typography variant="h5" fontWeight="bold" marginTop={3}>
//         Select Body Part
//       </Typography>
//       <Box
//         sx={{
//           display: "flex",
//           overflowX: "auto",
//           whiteSpace: "nowrap",
//           padding: "10px 0",
//           gap: "8px",
//         }}
//       >
//         {bodyParts.map((bodyPart) => (
//           <Button
//             key={bodyPart}
//             variant={selectedBodyPart === bodyPart ? "contained" : "outlined"}
//             onClick={() => setSelectedBodyPart(bodyPart)}
//             sx={{ minWidth: "70px", fontSize: "14px" }} // Reduced button size
//           >
//             {bodyPart.toUpperCase()}
//           </Button>
//         ))}
//       </Box>
 
//       {/* Diet Recommendations Section */}
//       {selectedBodyPart && (
//         <>
//           <Typography variant="h6" fontWeight="bold" marginTop={3}>
//             Diet Recommendations for {selectedBodyPart.toUpperCase()}:
//           </Typography>
//           <Typography variant="body1" marginTop={1}>
//             {dietRecommendations[selectedBodyPart.toLowerCase()] || "No specific diet available."}
//           </Typography>
//         </>
//       )}
 
//       {/* Exercises Section */}
//       <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3} marginTop={3}>
//         {exercises.length === 0 ? (
//           <Typography variant="body1" color="textSecondary" textAlign="center">
//             {selectedBodyPart ? "No exercises found for this body part." : "Select a body part to see exercises."}
//           </Typography>
//         ) : (
//           exercises.map((exercise) => (
//             <Card key={exercise.id} sx={{ minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//               <CardMedia component="img" height="400" image={exercise.gifUrl} alt={exercise.name} />
 
//               {/* Card Content */}
//               <CardContent sx={{ padding: "1px", textAlign: "center" }}>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {exercise.name}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary">
//                   Target: {exercise.target}
//                 </Typography>
 
//                 {/* Reps Input */}
//                 <TextField
//                   label="Reps"
//                   type="number"
//                   value={reps[exercise.id] || ""}
//                   onChange={(e) => setReps((prev) => ({ ...prev, [exercise.id]: Math.max(0, Number(e.target.value)) }))} // Prevent negative reps
//                   fullWidth
//                   margin="normal"
//                 />
 
//                 {/* Do Exercise Button */}
//                 <Button
//                   variant="contained"
//                   onClick={() => calculateCalories(exercise.id, reps[exercise.id] || 0)}
//                   sx={{ marginTop: "8px" }}
//                 >
//                   Do Exercise
//                 </Button>
 
//                 {/* Display Calories Burned */}
//                 {caloriesBurned[exercise.id] !== undefined && (
//                   <Typography variant="body2" color="textSecondary" marginTop={2}>
//                     Calories burned: {caloriesBurned[exercise.id].toFixed(2)} kcal
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </Box>
//     </Container>
//     </AppLayout>
//     </>
//   );
// };
 
// export default FitnessExercises;
 
 
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardMedia, Grid, Box, Button, Typography, Container, TextField } from "@mui/material";
// import { AppLayout } from "@/components/layout/AppLayout";

// // Type Definitions
// interface Exercise {
//   id: string;
//   name: string;
//   gifUrl: string;
//   target: string;
// }

// const BASE_API_URL = "https://exercisedb.p.rapidapi.com";

 
// const API_HEADERS = {
//   "X-RapidAPI-Key": "2a2f8f587dmsh38516a70a23a50cp1d2eebjsnb4a41ab3c0e3", // Replace with your actual API key
//   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
// };
// // const API_HEADERS = {
// //   "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with your actual API key
// //   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
// // };

// // Diet recommendations
// const dietRecommendations: { [key: string]: string } = {
//   "back": "For a strong back, incorporate high-protein foods like lean meats, eggs, and fish.",
//   "cardio": "For cardio workouts, eat complex carbs (whole grains) and lean proteins (chicken, turkey).",
//   "chest": "For chest muscles, focus on high-protein foods like chicken, fish, and nuts.",
//   "lower arms": "For lower arms, consume adequate protein with healthy fats from nuts and seeds.",
//   "lower legs": "To build lower legs, focus on lean proteins and complex carbs like quinoa and sweet potatoes.",
//   "neck": "For neck exercises, consume anti-inflammatory foods like turmeric and berries.",
//   "shoulders": "Build shoulder strength with lean proteins and plenty of vegetables.",
//   "upper arms": "Target upper arms with protein-rich foods like turkey, tofu, and beans.",
//   "upper legs": "For leg muscles, eat lean proteins and energy-rich carbs like brown rice and oats.",
//   "waist": "For a slim waistline, focus on high-fiber vegetables, lean proteins, and whole grains."
// };

// const FitnessExercises = () => {
//   const [exercises, setExercises] = useState<Exercise[]>([]);
//   const [bodyParts, setBodyParts] = useState<string[]>([]);
//   const [selectedBodyPart, setSelectedBodyPart] = useState("");
//   const [reps, setReps] = useState<{ [key: string]: number }>({});
//   const [caloriesBurned, setCaloriesBurned] = useState<{ [key: string]: number }>({});

//   useEffect(() => {
//     const fetchBodyParts = async () => {
//       try {
//         const response = await axios.get<string[]>(`${BASE_API_URL}/exercises/bodyPartList`, { headers: API_HEADERS });
//         setBodyParts(response.data);
//       } catch (error) {
//         console.error("Error fetching body parts:", error);
//       }
//     };
//     fetchBodyParts();
//   }, []);

//   useEffect(() => {
//     if (selectedBodyPart) {
//       fetchExercisesByBodyPart(selectedBodyPart);
//     }
//   }, [selectedBodyPart]);

//   const fetchExercisesByBodyPart = async (bodyPart: string) => {
//     try {
//       const response = await axios.get<Exercise[]>(`${BASE_API_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}`, { headers: API_HEADERS });
//       setExercises(response.data);
//     } catch (error) {
//       console.error("Error fetching exercises:", error);
//     }
//   };

//   const calculateCalories = (exerciseId: string, numReps: number) => {
//     const calories = numReps * 0.05; // Example: 0.05 calories burned per rep
//     setCaloriesBurned((prev) => ({
//       ...prev,
//       [exerciseId]: calories
//     }));
//   };

//   return (
//     <AppLayout>
//       <Container maxWidth="lg">
//         <Typography variant="h4" fontWeight="bold" textAlign="center" marginTop={3} gutterBottom>
//           Fitness Exercise Library
//         </Typography>

//         {/* Body Parts Selection */}
//         <Typography variant="h5" fontWeight="bold" marginTop={3} textAlign="center">
//           Select Body Part
//         </Typography>
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: "center",
//             gap: "10px",
//             marginTop: "15px"
//           }}
//         >
//           {bodyParts.map((bodyPart) => (
//             <Button
//               key={bodyPart}
//               variant={selectedBodyPart === bodyPart ? "contained" : "outlined"}
//               onClick={() => setSelectedBodyPart(bodyPart)}
//               sx={{ fontSize: "14px", padding: "8px 12px" }}
//             >
//               {bodyPart.toUpperCase()}
//             </Button>
//           ))}
//         </Box>

//         {/* Diet Recommendations */}
//         {selectedBodyPart && (
//           <Box marginTop={4} textAlign="center">
//             <Typography variant="h6" fontWeight="bold">
//               Diet Recommendations for {selectedBodyPart.toUpperCase()}:
//             </Typography>
//             <Typography variant="body1" marginTop={1}>
//               {dietRecommendations[selectedBodyPart.toLowerCase()] || "No specific diet available."}
//             </Typography>
//           </Box>
//         )}

//         {/* Exercises Section */}
//         <Grid container spacing={3} marginTop={4} justifyContent="center">
//           {exercises.length === 0 ? (
//             <Typography variant="body1" color="textSecondary" textAlign="center" width="100%">
//               {selectedBodyPart ? "No exercises found for this body part." : "Select a body part to see exercises."}
//             </Typography>
//           ) : (
//             exercises.map((exercise) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={exercise.id}>
//                 <Card sx={{ minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//                   <CardMedia component="img" height="400" image={exercise.gifUrl} alt={exercise.name} />
//                   <CardContent sx={{ textAlign: "center" }}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       {exercise.name}
//                     </Typography>
//                     <Typography variant="caption" color="textSecondary">
//                       Target: {exercise.target}
//                     </Typography>

//                     {/* Reps Input */}
//                     <TextField
//                       label="Reps"
//                       type="number"
//                       value={reps[exercise.id] || ""}
//                       onChange={(e) =>
//                         setReps((prev) => ({ ...prev, [exercise.id]: Math.max(0, Number(e.target.value)) }))
//                       }
//                       fullWidth
//                       margin="normal"
//                     />

//                     {/* Do Exercise Button */}
//                     <Button
//                       variant="contained"
//                       onClick={() => calculateCalories(exercise.id, reps[exercise.id] || 0)}
//                       sx={{ marginTop: "8px", width: "100%" }}
//                     >
//                       Do Exercise
//                     </Button>

//                     {/* Display Calories Burned */}
//                     {caloriesBurned[exercise.id] !== undefined && (
//                       <Typography variant="body2" color="textSecondary" marginTop={2}>
//                         Calories burned: {caloriesBurned[exercise.id].toFixed(2)} kcal
//                       </Typography>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))
//           )}
//         </Grid>
//       </Container>
//     </AppLayout>
//   );
// };

// export default FitnessExercises;


import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Grid, Box, Button, Typography, Container, TextField } from "@mui/material";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "../../config/supabaseClient"; // Ensure you have the correct Supabase client import
import { useNavigate } from "react-router-dom";

// Type Definitions
interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
}

const BASE_API_URL = "https://exercisedb.p.rapidapi.com";
const API_HEADERS = {
 "X-RapidAPI-Key": "2a2f8f587dmsh38516a70a23a50cp1d2eebjsnb4a41ab3c0e3", // Replace with your actual API key
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
};
// const API_HEADERS = {
//   "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with your actual API key
//   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
// };

const FitnessExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [caloriesBurned, setCaloriesBurned] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        const response = await axios.get<string[]>(`${BASE_API_URL}/exercises/bodyPartList`, { headers: API_HEADERS });
        setBodyParts(response.data);
      } catch (error) {
        console.error("Error fetching body parts:", error);
      }
    };
    fetchBodyParts();
  }, []);

  useEffect(() => {
    if (selectedBodyPart) {
      fetchExercisesByBodyPart(selectedBodyPart);
    }
  }, [selectedBodyPart]);

  const fetchExercisesByBodyPart = async (bodyPart: string) => {
    try {
      const response = await axios.get<Exercise[]>(`${BASE_API_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}`, { headers: API_HEADERS });
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const calculateCalories = async (exercise: Exercise, numReps: number) => {
    const calories = numReps * 0.05; // Example: 0.05 calories burned per rep
    setCaloriesBurned((prev) => ({ ...prev, [exercise.id]: calories }));

    // Save to Supabase
    await saveExerciseToDB(exercise, numReps, calories);
  };

  const saveExerciseToDB = async (exercise: Exercise, numReps: number, calories: number) => {
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user?.user) {
      console.error("User not authenticated");
      navigate("/login");
      return;
    }

    const { error: insertError } = await supabase.from("exercises").insert([
      {
        user_id: user.user.id,
        exercise_name: exercise.name,
        body_part: exercise.target,
        reps: numReps,
        calories_burned: calories
      }
    ]);

    if (insertError) {
      console.error("Error saving exercise:", insertError);
    } else {
      console.log("Exercise saved successfully");
    }
  };

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" className="bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text" fontWeight="bold" textAlign="center" marginTop={3} gutterBottom>
          Fitness Exercise Library
        </Typography>

        {/* Body Parts Selection */}
        <Typography variant="h5" fontWeight="bold" marginTop={3} textAlign="center">
          Select Body Part
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
          {bodyParts.map((bodyPart) => (
            <Button
            key={bodyPart}
            variant="outlined"
            onClick={() => setSelectedBodyPart(bodyPart)}
            sx={{
              fontSize: "14px",
              padding: "8px 12px",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "transparent",
              background: "linear-gradient(to right, #200f7b, #961aae)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
              "&:before": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                padding: "2px",
                background: "linear-gradient(to right, #200f7b, #961aae)",
                WebkitMask: "linear-gradient(white, white) content-box, linear-gradient(white, white)",
                WebkitMaskComposite: "destination-out",
                maskComposite: "exclude",
              },
            }}
          >
            {bodyPart.toUpperCase()}
          </Button>
          ))}
        </Box>

        {/* Exercises Section */}
        <Grid container spacing={3} marginTop={4} justifyContent="center">
          {exercises.length === 0 ? (
            <Typography variant="body1" color="textSecondary" textAlign="center" width="100%">
              {selectedBodyPart ? "No exercises found for this body part." : "Select a body part to see exercises."}
            </Typography>
          ) : (
            exercises.map((exercise) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={exercise.id}>
                <Card sx={{ minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <CardMedia component="img" height="400" image={exercise.gifUrl} alt={exercise.name} />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {exercise.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Target: {exercise.target}
                    </Typography>

                    {/* Reps Input */}
                    <TextField
                      label="Reps"
                      type="number"
                      value={reps[exercise.id] || ""}
                      onChange={(e) =>
                        setReps((prev) => ({ ...prev, [exercise.id]: Math.max(0, Number(e.target.value)) }))
                      }
                      fullWidth
                      margin="normal"
                    />

                    {/* Do Exercise Button */}
                    <Button
                      variant="contained"
                      onClick={() => calculateCalories(exercise, reps[exercise.id] || 0)}
                      sx={{ marginTop: "8px", width: "100%" }}
                    >
                      Do Exercise
                    </Button>

                    {/* Display Calories Burned */}
                    {caloriesBurned[exercise.id] !== undefined && (
                      <Typography variant="body2" color="textSecondary" marginTop={2}>
                        Calories burned: {caloriesBurned[exercise.id].toFixed(2)} kcal
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default FitnessExercises;
