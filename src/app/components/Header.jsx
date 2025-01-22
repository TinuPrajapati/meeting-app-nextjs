import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { LogOut, Moon, Settings, Sun, Video } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut, useSession } from 'next-auth/react'


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
    <header className="px-4 lg:px-6 h-[10vh] border-b-2 flex items-center justify-between sticky top-0 bg-white  dark:bg-black/50 border-yellow-400">
      <Link className="flex items-center justify-center" href="/">
        <Video className="h-6 w-6 text-blue-400 font-bold" />
        <span className="ml-2 text-2xl font-bold dark:text-white">Video-Meeting</span>
      </Link>
      <div className='flex items-center gap-4'>
        <div className=' h-full flex flex-col text-[1rem]'>
          <p className=''>{currentDate.day}</p>
          <p className='text-blue-400 font-bold'>{currentDate.date}</p>
        </div>
        <Button variant="ghost" size="icon" className="active:scale-90 hover:bg-black/20 dark:hover:bg-white/20" onClick={changeTheme} >
          {theme ? <Sun className='text-yellow-300' /> : <Moon className='text-blue-400' />}
        </Button>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Avatar className='cursor-pointer w-10 h-10 '>
              {session?.user.image ?
                <AvatarImage src={session.user.image} className="rounded-full" />
                :
                <AvatarFallback className="bg-sky-400 text-white text-2xl font-semibold" >{userPlaceHolder}</AvatarFallback>
              }
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className=" p-2 border-2 border-yellow-400 flex flex-col items-center gap-1" >
            <DropdownMenuItem className="hover:bg-black/20 py-1 px-3 text-lg cursor-pointer">My Account</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-black/20 py-1 px-3 text-lg cursor-pointer"><Settings/> Setting</DropdownMenuItem>
            <DropdownMenuItem  onClick={handleLogout} className="hover:bg-black/20 py-1 px-3 text-lg cursor-pointer"><LogOut/>  SignOut</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  )
}

export default Header