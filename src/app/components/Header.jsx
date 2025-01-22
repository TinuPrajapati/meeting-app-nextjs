import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { LogOut, Moon, Settings, Sun, Video } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import meeting from "../../../public/meeting.png"

const Header = () => {
  const [theme, setTheme] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState({
    day: '',
    date: ''
  });
  const { data: session } = useSession();

  const changeTheme = () => {
    setTheme((prev) => !prev);
    document.documentElement.classList.toggle("dark", !theme);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/user-auth" })
  }

  const userPlaceHolder = session?.user.name[0]

  useEffect(() => {
    const updateDate = () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const day = days[today.getDay()];
      const date = today.toLocaleDateString();
      const time = today.toLocaleTimeString();

      setCurrentDate({ day, date });
    };

    updateDate();
  }, []);
  return (
    <header className=" w-full h-[10vh] flex justify-center sticky top-2 z-50">
      <div className='w-[90%] h-full flex justify-between bg-sky-400/20 backdrop-blur-xl rounded-full border-2 border-sky-400 px-3 py-1'>
        <Link className="flex items-center justify-center" href="/">
          <Image src={meeting} width={30} height={30} alt="no icon" />
          <span className="ml-2 text-2xl font-bold font-mono dark:text-white">MeetHub</span>
        </Link>
        <div className=' flex items-center gap-1 lg:gap-2'>
          <div className=' h-full flex-col text-[1rem] hidden lg:flex '>
            <p className=''>{currentDate.day}</p>
            <p className='text-blue-400 font-bold'>{currentDate.date}</p>
          </div>
          <Button variant="ghost" size="icon" className="active:scale-90 hover:bg-black/20 rounded-md dark:hover:bg-white/20" onClick={changeTheme} >
            {theme ? <Sun className='text-yellow-300' /> : <Moon className='text-blue-400 w-10 h-10' />}
          </Button>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar className='cursor-pointer w-8 h-8 lg:w-10 lg:h-10'>
                {session?.user.image ?
                  <AvatarImage src={session.user.image} className="rounded-full" />
                  :
                  <AvatarFallback className="bg-sky-400 text-white text-2xl font-semibold" >{userPlaceHolder}</AvatarFallback>
                }
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" p-2 border-2  border-yellow-400 flex flex-col items-center gap-1 rounded-lg" >
              <DropdownMenuItem className="hover:bg-black/20 py-1 px-3 text-lg cursor-pointer">My Account</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-black/20 py-1 px-3 text-lg cursor-pointer"><Settings /> Setting</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-black/20 py-1 px-3 text-lg cursor-pointer"><LogOut />  SignOut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </header>
  )
}

export default Header