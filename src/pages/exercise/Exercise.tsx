import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Button,
  Typography,
  Container,
  TextField,
} from "@mui/material";
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
  "X-RapidAPI-Key": "3684233175mshce1a250c5023730p1f79c6jsn7f9939a9e774", // Replace with your actual API key
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};
// const API_HEADERS = {
//   "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with your actual API key
//   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
// };

const Exercise = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [caloriesBurned, setCaloriesBurned] = useState<{
    [key: string]: number;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        const response = await axios.get<string[]>(
          `${BASE_API_URL}/exercises/bodyPartList`,
          { headers: API_HEADERS }
        );
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
      const response = await axios.get<Exercise[]>(
        `${BASE_API_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}`,
        { headers: API_HEADERS }
      );
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

  const saveExerciseToDB = async (
    exercise: Exercise,
    numReps: number,
    calories: number
  ) => {
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
        calories_burned: calories,
      },
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
        <Typography
          variant="h4"
          className="bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text"
          fontWeight="bold"
          textAlign="center"
          marginTop={3}
          gutterBottom
        >
          Fitness Exercise Library
        </Typography>

        {/* Body Parts Selection */}
        <Typography
          variant="h5"
          fontWeight="bold"
          marginTop={3}
          textAlign="center"
        >
          Select Body Part
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
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
                  WebkitMask:
                    "linear-gradient(white, white) content-box, linear-gradient(white, white)",
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
        <Grid
          container
          spacing={3}
          marginTop={4}
          justifyContent="center"
          className="bg-gradient-to-r from-[#200f7b] to-[#961aae] p-6"
        >
          {exercises.length === 0 ? (
            <Typography
              variant="body1"
              color="white"
              textAlign="center"
              width="100%"
            >
              {selectedBodyPart
                ? "No exercises found for this body part."
                : "Select a body part to see exercises."}
            </Typography>
          ) : (
            exercises.map((exercise) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={exercise.id}>
                <Card
                  sx={{
                    minHeight: "480px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={exercise.gifUrl}
                    alt={exercise.name}
                  />
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
                        setReps((prev) => ({
                          ...prev,
                          [exercise.id]: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      fullWidth
                      margin="normal"
                    />

                    {/* Do Exercise Button */}
                    <Button
                      variant="contained"
                      onClick={() =>
                        calculateCalories(exercise, reps[exercise.id] || 0)
                      }
                      sx={{ marginTop: "8px", width: "100%" }}
                    >
                      Do Exercise
                    </Button>

                    {/* Display Calories Burned */}
                    {caloriesBurned[exercise.id] !== undefined && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        marginTop={2}
                      >
                        Calories burned:{" "}
                        {caloriesBurned[exercise.id].toFixed(2)} kcal
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

export default Exercise;
