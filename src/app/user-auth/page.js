"use client";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { signIn } from "next-auth/react";
import loginPic from "../../../public/LoginPic.png";
import google from "../../../public/google.png";
import github from "../../../public/github.png";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXTAUTH_URL;

  const handleLogin = async (provider) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: url });
    } catch (error) {
      toast.error(`Failed to login with ${provider}! Please Try again`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("hasShownWelcome");
  }, []);

  return (
    <div className="min-h-screen lg:h-[100vh] flex flex-wrap bg-gradient-to-r from-blue-200 to-purple-200 animate-fadeIn">
      {loading && <Loader />}
      <div className="w-full h-full flex flex-col justify-center p-8 lg:w-1/2 animate-slideInLeft">
        <div className="max-w-md mx-auto font-mono">
          <h1 className="mb-4 text-3xl font-bold text-center animate-fadeInUp">
            Welcome to My Video Call Application 👋
          </h1>
          <p className="text-center mb-4 text-gray-400 animate-fadeInUp delay-200">
            Connect with your team anytime, anywhere. Join or start meetings with crystal-clear HD video and audio.
          </p>
          <div className="space-y-2 animate-fadeInUp delay-400">
            <Button
              className="w-full h-14 rounded-xl active:scale-90 bg-white flex justify-center items-center gap-2 text-lg font-mono font-semibold"
              variant="outline"
              onClick={() => handleLogin("google")}
            >
              <Image src={google} width={20} height={20} alt="Google" />
              Login With Google
            </Button>
            <div className="w-full h-10 flex justify-center items-center gap-2">
              <div className="w-[45%] h-[0.15rem] bg-black/20"></div>
              <div>OR</div>
              <div className="w-[45%] h-[0.15rem] bg-black/20"></div>
            </div>
            <Button
              className="w-full h-14 rounded-xl active:scale-90 bg-white flex justify-center items-center gap-2 text-lg font-mono font-semibold"
              variant="outline"
              onClick={() => handleLogin("github")}
            >
              <Image src={github} width={20} height={20} alt="GitHub" /> Login With Github
            </Button>
          </div>
        </div>
      </div>
      <div className="block w-full h-1/2 lg:w-1/2 lg:h-full animate-slideInRight">
        <Image
          src={loginPic}
          width={1080}
          height={1080}
          alt="Login Pic"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default AuthPage;
