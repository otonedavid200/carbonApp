import React, { useState, useRef, useEffect } from "react";
import {
  QuestionMarkCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BASE_URL } from "../components/URLs";
import axios from "axios";

const SecurityComponent: React.FC = () => {
  const [seconds, setSeconds] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [seconds]);

  const handleResendCode = () => {
    setSeconds(60);
    setIsResendEnabled(false);
    // Add logic to resend the OTP code
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(); // Trigger form submission when Enter key is pressed
    }
  };
  const enterVerify = otp.join("");
  const handleSubmit = () => {
    axios
      .post(`${BASE_URL}/verify`, { verify: enterVerify }) // Assuming the API expects an object with the email key
      .then((response) => {
        console.log(response.data);
        // Process response data if necessary
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        navigate("/verify"); // Redirect to /verify
      });
  };

  return (
    <div className="relative min-h-screen p-4">
      {/* Question Mark Icon */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center">
        <QuestionMarkCircleIcon className="h-6 w-6 text-gray-600" />
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white p-6 space-y-10 mt-12">
        <h1 className="text-3xl text-[#09275b] font-bold mb-4">
          Security Check
        </h1>
        <p className="text-[#a0a0a0] mb-4">
          We would like to verify your account ownership using the code we sent
          to your email
        </p>
        <div className="flex justify-center mb-4">
          <LockClosedIcon className="h-12 w-12 text-gray-600" />
        </div>

        {/* OTP Input Fields */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="password"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-blue-500 text-2xl bg-gray-100"
                ref={(ref) => ref && (inputRefs.current[index] = ref)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-10 mb-4 px-12 py-3 bg-[#ded3fa] rounded-full text-[#5f40b0] font-semibold"
          >
            Submit
          </button>
        </form>

        {/* Resend Code Section */}
        <div className="flex flex-col items-center mt-4">
          <div className="text-gray-700 mb-8">
            {isResendEnabled ? (
              <button
                onClick={handleResendCode}
                className="text-black hover:underline"
              >
                Didn’t receive the code?{" "}
                <span className="text-[#5f40b0] font-semibold">Resend</span>
              </button>
            ) : (
              <p className="mt-3">Resend in {seconds} seconds</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityComponent;
