import BoardsPage from "@/components/general/BoardsPage"
import { getCurrentUser } from "@/lib/auth/currentUser"
import prisma from "@/lib/prisma";
import { toast } from "sonner";

async function fetchUserBoards(userId:string,category:string,q:string,status:string){
    try {
        const boards=await prisma.board.findMany({
            where:{
                userId:userId,
                ...(category && category!="all" ? {category:category}: {}),
                ...(status && status!="all"? {status:status}: {}),
                ...(q?{
                    OR:[
                        {name:{contains:q,mode:"insensitive"}},
                        {description:{contains:q,mode:"insensitive"}},
                    ]
                }:{})
            }
        })

        if(boards){
            return boards
        }
    } catch (error) {
        toast.error("An error occured while fetching users boards")
    }
}

interface SearchParamsProps{
    searchParams:Promise<{
        q?:string,
        category?:string,
        status?:string
    }>
}



export default async function Board({searchParams}:SearchParamsProps){
    const {category,q,status}=await searchParams
    const currentUser=await getCurrentUser();
    const boards=await fetchUserBoards(currentUser.id,category,q,status)
    if(!boards) return null
    return(
        <BoardsPage boards={boards}/>
    )
}

