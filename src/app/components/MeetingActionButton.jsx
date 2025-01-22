import { Button } from '@/components/ui/button';
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Copy, Link2, LinkIcon, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Loader from './Loader';


const MeetingActionButton = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [baseUrl, setBaseUrl] = useState("");
    const [url, setUrl] = useState("")
    const [input, setInput] = useState("")
    const [color, setColor] = useState(false)
    const router = useRouter();

    const handleMeetingLater = () => {
        const roomId = uuidv4();
        const finalUrl = `${baseUrl}/video-meeting/${roomId}`
        setUrl(roomId)
        setOpen(true);
        toast.success("Your room meeting Id/Link is generated")
    }

    const handleChange = (e) => {
        setInput(e.target.value);
    }

    const handleJoinMeeting = () => {
        if (input == "") {
            toast.error("Please enter a meeting link or code")
        } else {
            setLoading(true)
            const checkLink = input.includes(process.env.NEXT_PUBLIC_checkLink) ? input : `${baseUrl}/video-meeting/${input}`;
            toast.success("Joining Meeting ...")
            router.push(checkLink);
        }
    }

    const handleStartMeeting = () => {
        setLoading(true)
        const roomId = uuidv4();
        const finalUrl = `${baseUrl}/video-meeting/${roomId}`
        toast.success("Joining Meeting ...")
        router.push(finalUrl);
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success("Your room meeting Id/Link is copied");
    }


    useEffect(() => {
        console.log()
        setBaseUrl(window.location.origin)
    }, [])

    return (
        <>
            {loading && <Loader />}
            <div className='flex flex-col gap-2 lg:flex-row lg:gap-4'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-white text-black text-[1.1rem] h-10 hover:bg-black/10 outline-none border-none shadow-none">
                            Start New Meeting
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="p-1">
                        <DropdownMenuItem className="px-2 h-10 cursor-pointer" onClick={handleMeetingLater}>
                            <Link2 /> Create a new Meeting For Later
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-2 h-10 cursor-pointer" onClick={handleStartMeeting}>
                            <Plus /> Start an Instant Meeting
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='flex items-center relative w-[50%]'>
                    <LinkIcon className={`absolute pl-2 ${color && "text-blue-400"}`} />
                    <input
                        placeholder="Enter a code or link"
                        value={input}
                        onChange={handleChange}
                        onFocus={() => setColor(true)}
                        onBlur={() => setColor(false)}
                        className="bg-white text-black h-10 pl-8 w-[80%] text-lg rounded-l-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <Button className={`${color ? "bg-blue-400 text-white" : "bg-white text-black"} hover:bg-blue-400 hover:text-white active:scale-90   h-10 w-[20%] rounded-l-none shadow-none rounded-r-lg`}
                        onClick={handleJoinMeeting}
                    >
                        Join
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[30vw]">
                    <DialogHeader className="w-full space-y-4">
                        <DialogTitle>Here's your joining Information</DialogTitle>
                        <DialogDescription>
                            Send this to people that you want to meet with. Make sure that you save it so that you can use it later, too.
                        </DialogDescription>
                        <div className='w-full flex h-10 bg-gray-300 items-center gap-1 rounded-md py-1 px-4'>
                            <p className='w-[90%]'>{url.slice(0, 38)}...</p>
                            <button className="w-[10%] h-full text-black hover:bg-black/20 hover:rounded-md duration-200 active:scale-90 border-none outline-none flex justify-center items-center" onClick={copyToClipboard}>
                                <Copy className='w-5 h-5' />
                            </button>
                        </div>
                    </DialogHeader>

                </DialogContent>
            </Dialog>

        </>
    )
}

export default MeetingActionButton