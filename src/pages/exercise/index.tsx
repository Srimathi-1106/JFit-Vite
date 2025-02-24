import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Dumbbell, Search, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exercises = [
  {
    name: "Push-ups",
    category: "Strength",
    muscle: "Chest",
    difficulty: "Beginner",
    equipment: "None",
    youtubeUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
  },
  {
    name: "Pull-ups",
    category: "Strength",
    muscle: "Back",
    difficulty: "Intermediate",
    equipment: "Pull-up Bar",
    youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
  },
  {
    name: "Squats",
    category: "Strength",
    muscle: "Legs",
    difficulty: "Beginner",
    equipment: "None",
    youtubeUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ",
  },
  {
    name: "Running",
    category: "Cardio",
    muscle: "Full Body",
    difficulty: "Beginner",
    equipment: "None",
    youtubeUrl: "https://www.youtube.com/watch?v=_kGESn8ArrU",
  },
  {
    name: "Bicycle Crunches",
    category: "Core",
    muscle: "Abs",
    difficulty: "Beginner",
    equipment: "None",
    youtubeUrl: "https://www.youtube.com/watch?v=1we3bh9uhqY",
  },
  {
    name: "Plank",
    category: "Core",
    muscle: "Core",
    difficulty: "Beginner",
    equipment: "None",
    youtubeUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
  },
];

const ExercisePage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <div>
          <h2 className="text-base font-semibold leading-7 text-primary">
            Exercise Library
          </h2>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            Find Your Workout
          </p>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="library">Exercise Library</TabsTrigger>
            <TabsTrigger value="workouts">My Workouts</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search exercises..." className="pl-10" />
              </div>
              <Button>
                <Dumbbell className="mr-2 h-4 w-4" />
                Add Custom Exercise
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <Card
                  key={exercise.name}
                  className="p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {exercise.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>Category: {exercise.category}</p>
                    <p>Target Muscle: {exercise.muscle}</p>
                    <p>Difficulty: {exercise.difficulty}</p>
                    <p>Equipment: {exercise.equipment}</p>
                  </div>
                  <a
                    href={exercise.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-4"
                  >
                    <Button variant="outline" className="w-full">
                      <Youtube className="mr-2 h-4 w-4 text-red-600" />
                      Watch Tutorial
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <Dumbbell className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="text-lg font-semibold">No Workouts Yet</h3>
                <p className="text-gray-500">
                  Create your first workout routine by selecting exercises from
                  the library.
                </p>
                <Button>Create Workout</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ExercisePage;
