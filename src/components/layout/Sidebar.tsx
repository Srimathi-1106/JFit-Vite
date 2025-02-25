import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { Activity, Home, Dumbbell, Heart, Droplets, Menu, Footprints, Calculator, LogOut,Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Exercise", href: "/exercise", icon: Dumbbell },
  { name: "Breathing Exercise", href: "/breathing_exercise", icon: Stethoscope },
  { name: "Steps", href: "/steps", icon: Footprints },
  { name: "Food Calories", href: "/food_calorie", icon: Heart },
  { name: "BMI", href: "/bmi", icon: Calculator },
  
];

const NavigationContent = ({ handleLogout }) => (
  <nav className="flex flex-1 flex-col">
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul role="list" className="-mx-2 space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <svg width="0" height="0">
                <defs>
                  <linearGradient
                    id="icon-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop stopColor="#200f7b" offset="0%" />
                    <stop stopColor="#961aae" offset="100%" />
                  </linearGradient>
                </defs>
              </svg>
              <Link
                to={item.href}
                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out"
              >
                <item.icon
                  className="h-6 w-6 shrink-0 icon-hover-gradient"
                  aria-hidden="true"
                />
                <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#200f7b] group-hover:to-[#961aae] group-hover:bg-clip-text">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="group w-full flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out"
            >
              
              <LogOut className="h-6 w-6 shrink-0 group-hover:text-red-600" aria-hidden="true" />
              <span className="group-hover:text-transparent group-hover:bg-red-600 group-hover:bg-clip-text">Logout</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
);

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile hamburger menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-50" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
          <div className="flex h-full grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
                JFit
              </h1>
            </div>
            <NavigationContent handleLogout={handleLogout} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
              JFit
            </h1>
          </div>
          <NavigationContent handleLogout={handleLogout} />
        </div>
      </div>
    </>
  );
};


// Without Logout

// import { Link } from "react-router-dom";
// import {
//   Activity,
//   Home,
//   Dumbbell,
//   Heart,
//   Droplets,
//   Menu,
//   Footprints,
//   Calculator,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useState } from "react";

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: Home },
//   { name: "Exercise", href: "/exercise", icon: Dumbbell },
//   { name: "Steps", href: "/steps", icon: Footprints },
//   { name: "Food Calories", href: "/food_calorie", icon: Heart },
//   { name: "BMI", href: "/bmi", icon: Calculator },
// ];

// const NavigationContent = () => (
//   <nav className="flex flex-1 flex-col">
//     <ul role="list" className="flex flex-1 flex-col gap-y-7">
//       <li>
//         <ul role="list" className="-mx-2 space-y-1">
//           {navigation.map((item) => (
//             <li key={item.name}>
              // <svg width="0" height="0">
              //   <defs>
              //     <linearGradient
              //       id="icon-gradient"
              //       x1="0%"
              //       y1="0%"
              //       x2="100%"
              //       y2="0%"
              //     >
              //       <stop stopColor="#200f7b" offset="0%" />
              //       <stop stopColor="#961aae" offset="100%" />
              //     </linearGradient>
              //   </defs>
              // </svg>

//               <Link
//                 to={item.href}
//                 className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out"
//               >
//                 <item.icon
//                   className="h-6 w-6 shrink-0 icon-hover-gradient"
//                   aria-hidden="true"
//                 />
//                 <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#200f7b] group-hover:to-[#961aae] group-hover:bg-clip-text">
//                   {item.name}
//                 </span>
//               </Link>
//             </li>
//           ))}
          
//         </ul>
//       </li>
//     </ul>
//   </nav>
// );

// export const Sidebar = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* Mobile hamburger menu */}
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetTrigger asChild>
//           <Button
//             variant="ghost"
//             className="lg:hidden fixed top-4 left-4 z-50"
//             size="icon"
//           >
//             <Menu className="h-6 w-6" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="w-[240px] sm:w-[300px] h-full p-0">
//           <div className="h-full flex flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
//             <div className="flex h-16 shrink-0 items-center">
//               <h1 className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
//                 JFit
//               </h1>
//             </div>
//             <NavigationContent />
//           </div>
//         </SheetContent>
//       </Sheet>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
//         <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
//           <div className="flex h-16 shrink-0 items-center">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
//               JFit
//             </h1>
//           </div>
//           <NavigationContent />
//         </div>
//       </div>
//     </>
//   );
// };
