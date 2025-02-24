
import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const WaterPage = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const dailyGoal = 3000; // 3L in ml

  const addWater = (amount: number) => {
    setWaterIntake((prev) => Math.min(prev + amount, dailyGoal));
  };

  const progress = (waterIntake / dailyGoal) * 100;

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <div>
          <h2 className="text-base font-semibold leading-7 text-primary">
            Water Tracking
          </h2>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            Stay Hydrated
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main tracking card */}
          <Card className="col-span-2 p-6 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <Droplets className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Today's Water Intake</h3>
                <p className="text-sm text-gray-500">Track your hydration</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mb-8">
              <div className="text-4xl font-bold text-primary">
                {(waterIntake / 1000).toFixed(1)}L
              </div>
              <p className="text-sm text-gray-500">
                of {(dailyGoal / 1000).toFixed(1)}L goal
              </p>
              <div className="w-full max-w-md">
                <Slider
                  value={[progress]}
                  max={100}
                  step={1}
                  className="my-4"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button
                onClick={() => addWater(250)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                250ml
              </Button>
              <Button
                onClick={() => addWater(500)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                500ml
              </Button>
              <Button
                onClick={() => addWater(750)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                750ml
              </Button>
              <Button
                onClick={() => addWater(1000)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                1000ml
              </Button>
            </div>
          </Card>

          {/* Stats card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Water Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Progress</div>
                <div className="text-2xl font-semibold">
                  {Math.round(progress)}%
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Remaining Today
                </div>
                <div className="text-2xl font-semibold">
                  {((dailyGoal - waterIntake) / 1000).toFixed(1)}L
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Daily Goal
                </div>
                <div className="text-2xl font-semibold">
                  {(dailyGoal / 1000).toFixed(1)}L
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default WaterPage;
