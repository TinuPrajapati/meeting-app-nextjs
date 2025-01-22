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
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className={`flex-grow flex flex-col md:flex-row relative ${inMeeting ? "h-screen" : ""
          }`}
      >
        <div
          ref={containerRef}
          className="video-container flex-grow"
          style={{ height: inMeeting ? "100%" : "calc(100vh - 4rem)" }}
        ></div>
      </div>
      {!inMeeting && (
        <div className="flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Meeting Info
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Participant - {session?.user?.name || "You"}
            </p>
            <Button
              onClick={endMeeting}
              className="w-full bg-red-500 hover:bg-red-200 text-white hover:text-black"
            >
              End Meeting
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-700">
            <div className="text-center">
              <Image
                src="/videoQuality.jpg"
                alt="Feature 1"
                width={150}
                height={150}
                className="mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                HD Video Quality
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Experience crystal clear video calls
              </p>
            </div>
            <div className="text-center">
              <Image
                src="/screenShare.jpg"
                alt="Feature 1"
                width={150}
                height={150}
                className="mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                Screen Sharing
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Easily  share your screen with participant
              </p>
            </div>
            <div className="text-center">
              <Image
                src="/videoSecure.jpg"
                alt="Feature 1"
                width={150}
                height={150}
                className="mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                Secure Meetings
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Your meetings are protected and private
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default page