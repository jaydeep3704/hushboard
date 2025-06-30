import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup,DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ChevronDown,  LogOut, UserIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/currentUser";
import Link from "next/link";
import { Logout } from "@/lib/auth/actions";
import prisma from "@/lib/prisma";

async function getUserData(userId:string){
    try {
        const user=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                username:true,
                email:true,
            }
        })
        return user
    } catch (error) {
        
    }
}


export default async function UserDropDown(){
    const user=await getCurrentUser()
    const userData=await getUserData(user.id)
    console.log(user)
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" className="!p-0 !h-auto hover:!bg-transparent cursor-pointer !border-none">
                <Avatar >
                    {/* <AvatarImage src={user} alt="profile-image" /> */}
                    <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" mt-3" align="end">
                <DropdownMenuLabel className="flex flex-col ">
                    <span className="text-xs text-muted-foreground">{userData.username}</span>
                    <span className="text-xs text-muted-foreground">{userData.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                         <Link href={"/profile"} >
                             <UserIcon size={16} strokeWidth={2} className="opacity-60"/>
                             <span>
                                Profile
                             </span>
                         </Link>
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                 <DropdownMenuItem asChild>
                     <form action={
                        async ()=>{
                            "use server"
                            await Logout()
                        }
                     }>
                        <button className="flex items-center gap-2 w-full">
                            <LogOut size={16} strokeWidth={2} className="opacity-60"/>
                            <span>Logout</span>
                        </button>
                     </form>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}