import React from "react";
import Sleep from "@/components/SleepComponent/Sleep";
import WaterTracker from "@/components/WaterTrackerComponent/WaterTracker";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Dashboard() {
  return (
    <>
      <AppLayout>
        <main className="flex flex-col gap-4 mt-5">
          {/* Grid Container */}
          <div className="grid grid-cols-2 gap-3 bg-gray-200 p-4 rounded-lg">
            <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
              Your BMI
            </div>
            <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
              Steps taken
            </div>
            <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
              Water Intake
            </div>
            <div className="bg-white p-30 rounded-lg text-center font-bold text-gray-800 shadow-md">
              Sleep Time
            </div>
          </div>
          <Sleep />
          <WaterTracker />
        </main>
      </AppLayout>
    </>
  );
}
