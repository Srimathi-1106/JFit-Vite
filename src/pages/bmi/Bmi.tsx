import React, { useState } from "react";
// import "../../css_files/Bmi.css";
import low_bmi from "../../images/low_bmi.png";
import high_bmi from "../../images/high_bmi.png";
import normal_bmi from "../../images/normal_bmi.png";
import extreme_bmi from "../../images/extreme_bmi.png";
import { AppLayout } from "../../components/layout/AppLayout";

interface BmiResult {
  name: string;
  height?: number;
  weight?: number;
  bmi?: number;
  result?: string;
}

const Bmi: React.FC = () => {
  const [num, setNum] = useState<BmiResult>({ name: "Your" });
  const [height, setHeight] = useState<number | undefined>();
  const [weight, setWeight] = useState<number | undefined>();
  const [curBmi, setCurBmi] = useState<string | null>(null);

  function calculate() {
    if (!height || !weight) return;

    const bmi = parseFloat((weight / (height / 100) ** 2).toFixed(1));
    let result = "";

    if (bmi < 18.5) {
      result = "Underweight";
      setCurBmi(low_bmi);
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      result = "Healthy";
      setCurBmi(normal_bmi);
    } else if (bmi >= 25 && bmi <= 29.9) {
      result = "Overweight";
      setCurBmi(high_bmi);
    } else if (bmi >= 30) {
      result = "Obese";
      setCurBmi(extreme_bmi);
    }

    setNum((prev) => ({
      ...prev,
      height,
      weight,
      bmi,
      result,
    }));
  }

  return (
    <AppLayout>
      <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
            BMI Calculator
          </h2>
          <p className="mt-1 text-xl sm:text-3xl text-black font-bold tracking-tight">
            Track your BMI!
          </p>
        </div>

        {/* Form Wrapper */}
        <div className="wrapper flex flex-col gap-4 w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
          {/* Height Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Height (cm)
            </label>
            <input
              type="number"
              placeholder="Enter height"
              onChange={(e) => setHeight(Number(e.target.value))}
              className="input w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Weight Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Weight (kg)
            </label>
            <input
              type="number"
              placeholder="Enter weight"
              onChange={(e) => setWeight(Number(e.target.value))}
              className="input w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculate}
            className="w-full bg-gradient-to-r from-[#200f7b] to-[#961aae] text-white font-bold py-2 px-4 rounded-md shadow-md hover:opacity-90 transition duration-200"
          >
            Calculate
          </button>

          {/* Result Display */}
          {num.result && (
            <div className="text-center mt-4">
              <h1 className="text-lg sm:text-xl font-semibold text-green-500">
                {num.result}
              </h1>
              {curBmi && (
                <img
                  src={curBmi}
                  alt="BMI result"
                  className="h-40 sm:h-56 mx-auto mt-3"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Bmi;

// Sai Working Code
// import React, { useState } from "react";
// import "../../css_files/Bmi.css";
// import low_bmi from "../../images/low_bmi.png";
// import high_bmi from "../../images/high_bmi.png";
// import normal_bmi from "../../images/normal_bmi.png";
// import extreme_bmi from "../../images/extreme_bmi.png";
// import { AppLayout } from "../../components/layout/AppLayout";

// interface BmiResult {
//   name: string;
//   height?: number;
//   weight?: number;
//   bmi?: number;
//   result?: string;
// }

// const Bmi: React.FC = () => {
//   const [num, setNum] = useState<BmiResult>({ name: "Your" });
//   const [height, setHeight] = useState<number | undefined>();
//   const [weight, setWeight] = useState<number | undefined>();
//   const [curBmi, setCurBmi] = useState<string | null>(null);

//   function calculate() {
//     if (!height || !weight) return;

//     const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
//     let result = "";

//     if (bmi < 18.5) {
//       result = "Underweight";
//       setCurBmi(low_bmi);
//     } else if (bmi >= 18.5 && bmi <= 24.9) {
//       result = "Healthy";
//       setCurBmi(normal_bmi);
//     } else if (bmi >= 25 && bmi <= 29.9) {
//       result = "Overweight";
//       setCurBmi(high_bmi);
//     } else if (bmi >= 30) {
//       result = "Obese";
//       setCurBmi(extreme_bmi);
//     }

//     setNum((prev) => ({
//       ...prev,
//       height,
//       weight,
//       bmi,
//       result,
//     }));
//   }

//   return (
//     <>
//     <AppLayout>
//     <div className="App flex flex-col">
//         <div className="text-center">
//               <h2 className="font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
//                 BMI Calculator
//               </h2>
//               <p className="mt-1 text-3xl text-black font-bold tracking-tight">
//                 Track your BMI!
//               </p>
//             </div>
//       <div className="wrapper flex flex-col gap-4">
//         <h1>BMI Calculator</h1>

//         <h3>Height</h3>
//         <input
//           type="number"
//           placeholder="Enter height in cm"
//           onChange={(e) => setHeight(Number(e.target.value))}
//           className="input"
//         />

//         <h3>Weight</h3>
//         <input
//           type="number"
//           placeholder="Enter weight in kg"
//           onChange={(e) => setWeight(Number(e.target.value))}
//           className="input"
//         />

//         <br />
//         <br />

//         <button onClick={calculate}>Calculate</button>

//         {num.result && (
//           <div>
//             <h1 className="text-green-500">{num.result}</h1>
//             {curBmi && <img src={curBmi} alt='image' className="h-[340px] mx-auto mt-3" />}
//           </div>
//         )}
//       </div>
//     </div>
//     </AppLayout>
//     </>
//   );
// };

// export default Bmi;
