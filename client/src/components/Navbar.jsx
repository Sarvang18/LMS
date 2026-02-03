import { School,Menu } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Darkmode from "./Darkmode.jsx"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
  const user = 1
  return (
    <div className="h-16 dark:bg-[#0A0A0A] dark:border-b-gray-800 bg-white border-b   border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* desktop */}

      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">

        <div className="flex items-center gap-2">
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl">E-learning</h1>
        </div>
        
        {/* avatar and dark mode icon*/}

        <div className="flex gap-8">
          {
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                      className="grayscale"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>                 
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                      My learning
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline">Signup</Button>
                <Button>Login</Button>
              </div>
            )
          }
          
          {/* darkmode */}

          <Darkmode />

        </div>


      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <School />
        <h1 className="text-2xl font-extrabold">E-learning</h1>
       <MobileNavbar />
      </div>

    </div>
  );
};

export default Navbar;

const MobileNavbar = () =>{
  const role = "instructor"
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button size='icon' className='rounded-full bg-gray-200 hover:bg-gray-300'variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>


        <SheetContent className="flex flex-col px-4">

          <SheetHeader className="flex flex-row items-center gap-x-32 mt-4">
            <SheetTitle>E-learning</SheetTitle>
            <Darkmode />
          </SheetHeader>

          <nav className="flex flex-col space-y-4 px-4">
            <span>My learning</span>
            <span>Edit Profile</span>
            <span>Logout</span> 
          </nav>

          {
            role === "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Button type='submit'>Dashboard</Button>
                </SheetClose>
              </SheetFooter>
            )
          }

        </SheetContent>

      </Sheet>
    </div>
  )
}