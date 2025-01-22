"use client";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "./components/Loader";
import MeetingActionButton from "./components/MeetingActionButton";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      setLoading(false);
      const hasShownWelcome = localStorage.getItem("hasShownWelcome");
      if (!hasShownWelcome) {
        toast.success(`Welcome back! ${session.user.name}!`);
        localStorage.setItem("hasShownWelcome", "true");
      }
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  return (
    <div className="flex flex-col min-h-screen relative bg-purple-400/20">
      {loading && <Loader />}
      <Header />
      <main className="w-full min-h-[90vh] flex flex-col justify-center items-center gap-5 px-10 text-center">
        <h1 className="text-xl font-semibold font-mono sm:text-3xl md:text-5xl lg:text-6xl">
          Connect Face-to-Face, Anywhere in the World
        </h1>
        <p className="text-[0.8rem] w-full lg:w-[80%] text-black/50 font-mono">
          Experience crystal-clear video calls with our cutting-edge platform.
          Stay connected with friends, family, and colleagues, no matter where
          you are.
        </p>
        <MeetingActionButton />
      </main>
    </div>
  );
}
