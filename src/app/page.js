"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, Users, Globe, Shield } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "./components/Loader";
import MeetingActionButton from "./components/MeetingActionButton";
import MeetingSlice from "./components/MeetingSlice";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() =>{
    if(status === 'authenticated'){
      setLoading(false);
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if(!hasShownWelcome){
        toast.success(`Welcome back! ${session?.user?.name}!`)
        localStorage.setItem('hasShownWelcome','true');
      }
    }else if(status === 'unauthenticated'){
      setLoading(false);
    }
  },[status,session])

  return (
    <div className="flex flex-col min-h-screen bg-slate-300">
      {loading && <Loader />}
      <Header />
      <main className="flex-1">
        <section className="w-full min-h-[90vh] flex px-10">
          <div className="container flex flex-col justify-center  gap-6 px-4 md:px-6 w-full lg:w-1/2 ">
            <h1 className="text-2xl font-semibold sm:text-3xl md:text-5xl ">
              Connect Face-to-Face, Anywhere in the World
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500/80 md:text-xl dark:text-gray-400/50">
              Experience crystal-clear video calls with our cutting-edge
              platform. Stay connected with friends, family, and colleagues, no
              matter where you are.
            </p>
            <MeetingActionButton/>
          </div>
          <div className="hidden w-1/2 lg:flex justify-center items-center">
          <MeetingSlice/>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start justify-center">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Group Calls</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Connect with multiple people simultaneously
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Globe className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Global Reach</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Call anyone, anywhere in the world
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Shield className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Secure Calls</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  End-to-end encryption for your privacy
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Video className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">HD Quality</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Crystal clear audio and video
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Connecting Today
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join millions of users who trust VideoConnect for their video
                  calling needs. Try it now for free!
                </p>
              </div>
              <Button size="lg">Sign Up for Free</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
