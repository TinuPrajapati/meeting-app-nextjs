import { Button } from '@/components/ui/button';
import { Copy, Link2, LinkIcon, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Loader from './Loader';

const MeetingActionButton = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [dropdown, setDropDown] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [url, setUrl] = useState("");
    const [input, setInput] = useState("");
    const [color, setColor] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const handleMeetingLater = () => {
        const roomId = uuidv4();
        setUrl(`${baseUrl}/video-meeting/${roomId}`);
        setOpen(true);
        toast.success("Your meeting link has been generated!");
    };

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleJoinMeeting = () => {
        if (!input.trim()) {
            toast.error("Please enter a meeting link or code.");
            return;
        }

        setLoading(true);
        const checkLink = input.includes(process.env.NEXT_PUBLIC_CHECKLINK)
            ? input
            : `${baseUrl}/video-meeting/${input}`;

        toast.success("Joining Meeting...");
        router.push(checkLink);
    };

    const handleStartMeeting = () => {
        setLoading(true);
        const roomId = uuidv4();
        const finalUrl = `${baseUrl}/video-meeting/${roomId}`;
        toast.success("Starting Meeting...");
        router.push(finalUrl);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success("Meeting link copied to clipboard!");
    };

    return (
        <>
            {loading && <Loader />}
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                <div className="relative" onMouseLeave={() => setDropDown(false)}>
                    <button
                        className="bg-white h-14 w-[15vw] text-lg font-semibold rounded-xl active:scale-90 border-2 border-sky-400 "
                        onClick={() => setDropDown(true)}
                        
                    >
                        Start New Meeting
                    </button>
                    {dropdown && (
                        <div className="absolute w-[25vw] space-y-2 z-10 left-2 bg-white p-2 rounded-xl border-2 border-sky-400 top-2">
                            <button
                                className="px-3 h-10 cursor-pointer flex gap-3 items-center w-full rounded-xl hover:bg-black/10 duration-200 active:scale-90"
                                onClick={handleMeetingLater}
                            >
                                <Link2 /> Create a new Meeting For Later
                            </button>
                            <button
                                className="px-3 h-10 cursor-pointer flex gap-3 items-center w-full rounded-xl hover:bg-black/10 duration-200 active:scale-90"
                                onClick={handleStartMeeting}
                            >
                                <Plus /> Start an Instant Meeting
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex items-center relative w-[30vw] h-14">
                    <LinkIcon className={`absolute pl-2 ${color ? "text-blue-400" : ""}`} />
                    <input
                        placeholder="Enter a code or link"
                        value={input}
                        onChange={handleChange}
                        onFocus={() => setColor(true)}
                        onBlur={() => setColor(false)}
                        className="bg-white text-black h-full rounded-xl pl-8 pr-20 w-[100%] focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <Button
                        className={`${color ? "bg-blue-400 text-white" : "bg-white text-black"} hover:bg-blue-400 hover:text-white active:scale-90 h-full w-[20%] rounded-l-none shadow-none rounded-r-xl absolute right-0`}
                        onClick={handleJoinMeeting}
                    >
                        Join
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[30vw]">
                    <DialogHeader className="w-full space-y-4">
                        <DialogTitle>Here's your joining information</DialogTitle>
                        <DialogDescription>
                            Share this link with others to join your meeting. Save it for future use.
                        </DialogDescription>
                        <div className="w-full flex h-10 bg-gray-300 items-center gap-1 rounded-md py-1 px-4">
                            <p className="w-[90%] truncate">{url}</p>
                            <button
                                className="w-[10%] h-full text-black hover:bg-black/20 hover:rounded-md duration-200 active:scale-90 border-none outline-none flex justify-center items-center"
                                onClick={copyToClipboard}
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MeetingActionButton;
