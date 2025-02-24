// import type { Config } from "tailwindcss";

// export default {
//   theme: {
//     extend: {
//       backgroundImage: {
//         "primary-gradient": "linear-gradient(to right, #200f7b, #961aae)",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;

export default {
  theme: {
    extend: {
      colors: {
        "primary-gradient": "linear-gradient(to right, #200f7b, #961aae)", // Add this
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, #200f7b, #961aae)",
      },
    },
  },
  plugins: [],
};
