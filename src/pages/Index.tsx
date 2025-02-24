
import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Droplets, Moon, Dumbbell, Apple } from "lucide-react";

const stats = [
  { name: "Water Intake", value: "2.1L", target: "3L", icon: Droplets },
  { name: "Sleep", value: "7h 30m", target: "8h", icon: Moon },
  { name: "Exercise", value: "45min", target: "60min", icon: Dumbbell },
  { name: "Calories", value: "1,800", target: "2,000", icon: Apple },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-primary">
            Dashboard
          </h2>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back, User
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-x-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                  <div className="text-sm font-medium">{stat.name}</div>
                </div>
                <div className="mt-6">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-gray-500">
                    Target: {stat.target}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary" />
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
