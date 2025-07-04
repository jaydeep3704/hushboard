import BoardsPage from "@/components/general/BoardsPage"
import { getCurrentUser } from "@/lib/auth/currentUser"
import prisma from "@/lib/prisma";
import { toast } from "sonner";

async function fetchUserBoards(userId:string){
    try {
        const boards=await prisma.board.findMany({
            where:{
                userId:userId
            }
        })

        if(boards){
            return boards
        }
    } catch (error) {
        toast.error("An error occured while fetching users boards")
    }
}



export default async function Board(){
    const currentUser=await getCurrentUser();
    const boards=await fetchUserBoards(currentUser.id)
    if(!boards) return null
    return(
        <BoardsPage boards={boards}/>
    )
}

