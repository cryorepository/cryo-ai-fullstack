/*"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown, LogOut, SquareArrowOutUpRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { LoginPopup } from '@/components/login-popup'


export function SidebarPopover() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-0 py-2 flex justify-between h-fit cursor-pointer">
            <div className="flex items-center gap-2">
                <Avatar className="rounded-lg">
                <AvatarImage src="https://www.cryorepository.com/web-app-manifest-192x192.png" />
                <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col justify-start text-left">
                <h1>Username</h1>
                <p className="text-xs font-normal">example@gmail.com</p>
                </div>
            </div>

            <ChevronsUpDown />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-56">
            <div className="flex items-center gap-2 px-2 mb-3 mt-2">
                <Avatar className="rounded-lg">
                <AvatarImage src="https://www.cryorepository.com/web-app-manifest-192x192.png" />
                <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col justify-start text-left">
                <h1 className="font-semibold">Username</h1>
                <p className="text-xs">example@gmail.com</p>
                </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <a href="https://discord.gg" className="flex justify-between align-center w-full" target="_blank" rel="noopener noreferrer">
                Support
                <SquareArrowOutUpRight className="mt-[2px]" />
            </a>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
                <span className="text-red-800 font-semibold">
                    Clear Chats
                </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between cursor-pointer">
            <span className="text-red-800 font-semibold">
                Log out
            </span>
            <LogOut className="stroke-red-800" />
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginPopup />
      )}
    </>
  )
}*/

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, SquareArrowOutUpRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { LoginPopup } from '@/components/login-popup';
import { useRouter } from 'next/navigation';

export function SidebarDropdown() {
  const { isLoggedIn, username, email, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Calls POST /logout on Express
      router.push('/'); // Redirect to home or login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check viewport width on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 536);
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-0 py-2 flex justify-between h-fit cursor-pointer w-full">
              <div className="flex items-center gap-2">
                <Avatar className="rounded-lg">
                  <AvatarImage src="https://www.cryorepository.com/web-app-manifest-192x192.png" />
                  <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-start text-left max-w-[160px] overflow-hidden">
                  <h1>{username || 'User'}</h1>
                  <p className="text-xs font-normal truncate whitespace-nowrap overflow-hidden">{email || 'No email'}</p>
                </div>
              </div>
              <ChevronsUpDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isSmallScreen ? "top" : "right"} align={isSmallScreen ? "start" : "end"} className="w-56">
            <div className="flex items-center gap-2 px-2 mb-3 mt-2">
              <Avatar className="rounded-lg">
                <AvatarImage src="https://www.cryorepository.com/web-app-manifest-192x192.png" />
                <AvatarFallback>CR</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-start text-left">
                <h1 className="font-semibold">{username || 'User'}</h1>
                <p className="text-xs">{email || 'No email'}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a
                href="https://discord.gg"
                className="flex justify-between items-center w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                Support
                <SquareArrowOutUpRight className="mt-[2px]" />
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span className="text-red-800 font-semibold">Clear Chats</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between cursor-pointer" onClick={handleLogout}>
              <span className="text-red-800 font-semibold">Log out</span>
              <LogOut className="stroke-red-800" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginPopup />
      )}
    </>
  );
}