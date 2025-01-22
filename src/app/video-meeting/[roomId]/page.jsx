"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const page = () => {
  const { roomId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const containerRef = useRef(null)
  const [zp, setZp] = useState(null)
  const [inMeeting, setInMeeting] = useState(false)
  const [hasJoined, setHasJoined] = useState(false);

  const joinMeeting = async (element) => {
    if (zp) {
      toast.error("Meeting already joined. Skipping...");
      return;  // Prevent repeated join calls
    }

    const appID = process.env.NEXT_PUBLIC_ZEOAPP_ID;
    const serverSecret = process.env.NEXT_PUBLIC_ZEOSERVER_SECRET;

    if (!appID || !serverSecret) {
      toast.error("App ID or Server Secret is missing.");
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      Number(appID),
      serverSecret,
      roomId,
      session?.user?.id || Date.now().toString(),
      session?.user?.name || "Guest"
    );

    const zegoInstant = ZegoUIKitPrebuilt.create(kitToken);
    setZp(zegoInstant);

    zegoInstant.joinRoom({
      container: element,
      sharedLinks: [{ name: "Join via this link", url: `${window.location.origin}/video-meeting/${roomId}` }],
      scenario: { mode: ZegoUIKitPrebuilt.GroupCall, enableVideo: true },
      onJoinRoom: () => {
        setInMeeting(true);
        toast.success("Meeting Joined Successfully");
      },
      onLeaveRoom: () => endMeeting(),
    });
  };


  const endMeeting = () => {
    if (zp) {
      zp.destroy();
    }
    toast.success('Meeting end succesfully')
    setZp(null);
    setInMeeting(false)
    router.push('/')
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name && containerRef.current && !hasJoined) {
      if (!zp) {
        joinMeeting(containerRef.current);
        setHasJoined(true);
      }
    } else if (status === "unauthenticated") {
      console.log("Not authenticated");
      toast.error("Please Login Again");
      router.push("/login");
    }

    return () => {
      if (zp) {
        zp.destroy();
        setZp(null);
      }
    };
  }, [status, session]);  // Remove zp from dependencies to prevent re-triggering


  return (
    <div className="flex flex-col items-center min-h-screen bg-purple-400/20 dark:bg-gray-900">
      <div
        className={` ${inMeeting ? "w-[100vw] h-screen":"h-[80vh]"}`}
      >
        <div
          ref={containerRef}
          className="video-container flex-grow"
          style={{ height: inMeeting ? "100%" : "calc(80vh - 4rem)" }}
        ></div>
      </div>
      {!inMeeting && (
        <Button
          onClick={endMeeting}
          className="w-[50vw] h-14 rounded-xl bg-red-500 hover:bg-red-200 text-white hover:text-black"
        >
          End Meeting
        </Button>
      )}
    </div>
  )
}

export default page