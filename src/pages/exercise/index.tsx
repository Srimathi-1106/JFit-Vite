// import { AppLayout } from "@/components/layout/AppLayout";
// import { Card } from "@/components/ui/card";
// import { Dumbbell, Search, Youtube } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const exercises = [
//   {
//     name: "Push-ups",
//     category: "Strength",
//     muscle: "Chest",
//     difficulty: "Beginner",
//     equipment: "None",
//     youtubeUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
//   },
//   {
//     name: "Pull-ups",
//     category: "Strength",
//     muscle: "Back",
//     difficulty: "Intermediate",
//     equipment: "Pull-up Bar",
//     youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
//   },
//   {
//     name: "Squats",
//     category: "Strength",
//     muscle: "Legs",
//     difficulty: "Beginner",
//     equipment: "None",
//     youtubeUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
//   },
//   {
//     name: "Running",
//     category: "Cardio",
//     muscle: "Full Body",
//     difficulty: "Beginner",
//     equipment: "None",
//     youtubeUrl: "https://www.youtube.com/watch?v=_kGESn8ArrU",
//   },
//   {
//     name: "Bicycle Crunches",
//     category: "Core",
//     muscle: "Abs",
//     difficulty: "Beginner",
//     equipment: "None",
//     youtubeUrl: "https://www.youtube.com/watch?v=1we3bh9uhqY",
//   },
//   {
//     name: "Plank",
//     category: "Core",
//     muscle: "Core",
//     difficulty: "Beginner",
//     equipment: "None",
//     youtubeUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
//   },
// ];

// const ExercisePage = () => {
//   return (
//     <AppLayout>
//       <div className="flex flex-col gap-8 animate-fade-in">
//         <div>
//           <h2 className="text-base font-semibold leading-7 text-primary">
//             Exercise Library
//           </h2>
//           <p className="mt-1 text-3xl font-bold tracking-tight">
//             Find Your Workout
//           </p>
//         </div>

//         <Tabs defaultValue="library" className="w-full">
//           <TabsList className="grid w-full max-w-[400px] grid-cols-2">
//             <TabsTrigger value="library">Exercise Library</TabsTrigger>
//             <TabsTrigger value="workouts">My Workouts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="library" className="space-y-6 mt-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input placeholder="Search exercises..." className="pl-10" />
//               </div>
//               <Button>
//                 <Dumbbell className="mr-2 h-4 w-4" />
//                 Add Custom Exercise
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {exercises.map((exercise) => (
//                 <Card
//                   key={exercise.name}
//                   className="p-4 hover:shadow-lg transition-shadow"
//                 >
//                   <h3 className="font-semibold text-lg mb-2">
//                     {exercise.name}
//                   </h3>
//                   <div className="space-y-2 text-sm text-gray-500">
//                     <p>Category: {exercise.category}</p>
//                     <p>Target Muscle: {exercise.muscle}</p>
//                     <p>Difficulty: {exercise.difficulty}</p>
//                     <p>Equipment: {exercise.equipment}</p>
//                   </div>
//                   <a
//                     href={exercise.youtubeUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block w-full mt-4"
//                   >
//                     <Button variant="outline" className="w-full">
//                       <Youtube className="mr-2 h-4 w-4 text-red-600" />
//                       Watch Tutorial
//                     </Button>
//                   </a>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="workouts" className="mt-6">
//             <Card className="p-6">
//               <div className="text-center space-y-4">
//                 <Dumbbell className="h-12 w-12 mx-auto text-gray-400" />
//                 <h3 className="text-lg font-semibold">No Workouts Yet</h3>
//                 <p className="text-gray-500">
//                   Create your first workout routine by selecting exercises from
//                   the library.
//                 </p>
//                 <Button>Create Workout</Button>
//               </div>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </AppLayout>
//   );
// };

// export default ExercisePage;


import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Box, Button, Typography, Container, Stack } from "@mui/material";
// import { Sidebar } from "@/components/layout/Sidebar";
import { AppLayout } from "@/components/layout/AppLayout";
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

const FitnessExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");

  // Fetch available body parts on component mount
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

  // Fetch exercises when a body part is selected
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

  return (
    <>
    <AppLayout>
    <Container>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Fitness Exercise Library
      </Typography>

      {/* Body Parts Section - Now in one line with horizontal scroll */}
      <Typography variant="h5" fontWeight="bold" marginTop={3}>
        Select Body Part
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "10px 0",
          gap: "8px",
        }}
      >
        {bodyParts.map((bodyPart) => (
          <Button
            key={bodyPart}
            variant={selectedBodyPart === bodyPart ? "contained" : "outlined"}
            onClick={() => setSelectedBodyPart(bodyPart)}
            sx={{ minWidth: "100px", fontSize: "14px" }} // Reduced button size
          >
            {bodyPart.toUpperCase()}
          </Button>
        ))}
      </Box>

      {/* Exercises Section */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3} marginTop={3}>
        {exercises.length === 0 ? (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            {selectedBodyPart ? "No exercises found for this body part." : "Select a body part to see exercises."}
          </Typography>
        ) : (
          exercises.map((exercise) => (
            <Card key={exercise.id} sx={{ minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <CardMedia component="img" height="250" image={exercise.gifUrl} alt={exercise.name} />

              {/* Reduced CardContent size */}
              <CardContent sx={{ padding: "8px", textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exercise.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Target: {exercise.target}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
    </AppLayout>
    </>
  );
};

export default FitnessExercises;
