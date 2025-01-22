"use client";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import React, { useState,useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { signIn } from "next-auth/react";
import loginPic from "../../../public/Login pic.png"

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXTAUTH_URL;

  const handleLogin = async (provider) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: url });
      // toast.success(`SuccessFully Login with ${provider}`);
    } catch (error) {
      toast.error(`Failed to login with ${provider}! Please Try again`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
    localStorage.removeItem('hasShownWelcome')
  },[])
  return (
    <div className="h-[100vh] flex bg-gradient-to-r from-blue-200 to-purple-200">
      {loading && <Loader />}
      <div className="hidden w-1/2 h-full lg:block">
        <Image
          src={loginPic}
          width={1080}
          height={1080}
          alt="Login Pic"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full h-full flex flex-col justify-center p-8 lg:w-1/2">
        <div className="max-w-md mx-auto">
          <h1 className="mb-4 text-3xl font-bold text-center">
            Welcome to My Video Call Application 👋
          </h1>
          <p className="text-center mb-4 text-gray-400">
            Connect with your team anytime, anywhere. Join or start meetings
            with crystal-clear HD video and audio.
          </p>
          <div className="space-y-2">
            <Button
              className="w-full h-10 active:scale-90"
              variant="outline"
              onClick={() => handleLogin("google")}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login With Google
            </Button>
            <div className="w-full h-10 flex justify-center items-center gap-2">
              <div className="w-[45%] h-[0.15rem] bg-black/20"></div>
              <div>OR</div>
              <div className="w-[45%] h-[0.15rem] bg-black/20"></div>
            </div>
            <Button className="w-full h-10 active:scale-90" variant="outline"
             onClick={() => handleLogin("github")}>
              <Github className="mr-2" /> Login With Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
