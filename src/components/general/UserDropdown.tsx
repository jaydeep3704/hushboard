"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup,DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ChevronDown,  LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import { Logout } from "@/lib/auth/actions";

interface userProps{
    user?:{
        username?:string,
        email?:string,
        avatar?:string
    }
}

export default  function UserDropDown({user}:userProps){
    if (!user || !user.username) return null;
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" className="!p-0 !h-auto hover:!bg-transparent cursor-pointer !border-none">
                <Avatar >
                    <AvatarImage src={user.avatar} alt="profile-image" />
                    <AvatarFallback><UserIcon/></AvatarFallback>
                </Avatar>
                <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z- mt-3" align="end">
                <DropdownMenuLabel className="flex flex-col ">
                    <span className="text-xs text-muted-foreground">{user.username}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                 <DropdownMenuItem asChild>
                     
                        <button className="flex items-center gap-2 w-full" onClick={Logout}>
                            <LogOut size={16} strokeWidth={2} className="opacity-60"/>
                            <span>Logout</span>
                        </button>
                     
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}