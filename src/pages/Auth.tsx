import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash, FaDumbbell } from "react-icons/fa";
import zxcvbn from "zxcvbn";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async (user) => {
      if (!user) return;

      const { data, error } = await supabase.from("users").select("id").eq("id", user.id).single();

      if (error || !data) navigate("/register");
      else navigate("/dashboard");
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkUser(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Password Strength Calculation
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordStrength(zxcvbn(e.target.value).score);
  };

  const handleSignUp = async () => {
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert("Check your email to verify your account!");
  };

  const handleSignIn = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
  };

  return (
    // <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden " style={{width:"100vw", height:"100vh"}}>
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#351289] to-[#6E17A0] text-white relative overflow-hidden" style={{width:"100vw", height:"100vh"}}>

    {/* Floating Animated Dumbbells */}
      <motion.div
        className="absolute top-10 left-10 text-green-400 text-6xl opacity-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaDumbbell />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-green-400 text-6xl opacity-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaDumbbell />
      </motion.div>

      {/* StayFit Branding */}
      <motion.h1
        className="text-5xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        JFit
      </motion.h1>

      {/* Motivational Subtitle */}
      <motion.p
        className="text-lg text-gray-300 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        "Train Hard, Stay Strong, Keep Moving! "
      </motion.p>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 px-10 rounded-lg shadow-lg w-full flex flex-col gap-2 max-w-md text-center py-12"
      >
        {error && <p className="text-red-500">{error}</p>}

        {/*  Email Input */}
        <motion.input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          whileFocus={{ scale: 1.05 }}
        />

        {/* 🔹 Password Input with Toggle */}
        <div className="relative mt-2">
          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            value={password}
            onChange={handlePasswordChange}
            whileFocus={{ scale: 1.05 }}
          />
          <button
            className="absolute right-3 top-3 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        <div className="mt-2 h-2 w-full rounded bg-gray-600">
          <div
            className={`h-full transition-all duration-300 ${
              passwordStrength === 0
                ? "w-0"
                : passwordStrength === 1
                ? "w-1/4 bg-red-500"
                : passwordStrength === 2
                ? "w-2/4 bg-yellow-500"
                : passwordStrength === 3
                ? "w-3/4 bg-green-500"
                : "w-full bg-green-400"
            }`}
          ></div>
        </div>

        {/* Animated Buttons */}
        <motion.button
          onClick={handleSignUp}
          className="w-full bg-green-500 text-white py-2 rounded-md mt-4 hover:bg-green-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>

        <motion.button
          onClick={handleSignIn}
          className="w-full bg-blue-500 text-white py-2 rounded-md mt-2 hover:bg-blue-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        {/* <div className="text-center my-4 text-gray-400">or</div> */}

        {/* Google Authentication with Icon */}
        {/* <motion.button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 flex items-center justify-center gap-2 rounded-md hover:bg-red-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGoogle />
          Sign in with Google
        </motion.button> */}
      </motion.div>
    </div>
  );
};

export default Auth;
