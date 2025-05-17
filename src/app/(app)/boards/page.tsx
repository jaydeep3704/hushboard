"use client";
import { IconPlus } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EllipsisVertical, MessageSquareIcon, SaveIcon, Trash2, X } from 'lucide-react';
import axios from "axios";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import exportFromJSON from 'export-from-json'

interface Board {
  name: string;
  id: number;
  messages: Array<any>; // Ensuring that messages is an array
  slug: string;
}

const Page = () => {
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [inputs, setInputs] = useState<Array<string>>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [deletingBoardInfo, setDeletingBoardInfo] = useState<Board | null>(null)

  const onCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputText) return;

      const result = await axios.post("/api/boards/", { boardName: inputText });
      const response = await result.data;
      toast.success("Board Created !")
      fetchBoards();
    } catch (error: any) {
      console.log("Error: ", error.response.data);
    }

    setShowAddBoard(false);
    setInputText("");
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("/api/boards");
      const response = await result.data;
      setBoards(response);
      setInputs(response.map((board: Board) => board.name)); // Set inputs once the boards are fetched
    
    } catch (error: any) {
      console.log("Error: ", error.response.data);
    }
    setIsLoading(false);
  };

  const onBoardDelete = async () => {

    if (deletingBoardInfo) {
      const { slug, id } = deletingBoardInfo
      try {
        const response = await axios.delete(`/api/boards/${slug}/delete`)
        const data = await response.data
        if(response.status==200){
        const updatedBoards = boards.filter((board) => board.id !== id);
        setBoards(updatedBoards)
        setInputs(updatedBoards.map((board: Board) => board.name));
        toast.success(data.message)
        }
      } catch (error:any) {
        console.log("Error : ", error)
        const message = error?.response?.data?.error || "Something went wrong";
        toast.error(message);
      }
    }
    else {
      console.log("deleting Board info is null")
    }
    setDeletingBoardInfo(null)
    setShowAlertDialog(false)
  }


  const onBoardNameSave = async (boardName: string, index: number, slug: string) => {
    setEditingBoardId(null);  // Reset the editing state after saving
    try {
      const result = await axios.post(`/api/boards/${boardName}/edit`, { newBoardName: inputs[index], slug });
      const response = result.data;
      if(result.status==200){
        toast.success("Board Name Updated")
      }
      else{
        toast.error("Error while updating board name")
      }
    } catch (error:any) {
      console.log("Error : ", error)
      const message = error?.result?.data?.error || "Something went wrong";
      toast.error(message);
    }
  };

  const handleChange = (index: number, value: string) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[index] = value; // Update the value at the given index
      return updated;
    });
  };

  const boardNameTrimmer = (name: string) => {
    return name.length > 25 ? name.substring(0, 25) + " ..." : name;
  };

  if (isLoading) {
    return <BoardLoader />;
  }

  return (
    <section className="py-14 md:py-24 px-[4%] md:px-0">
      <div className="max-w-5xl mx-auto ">
        <h1 className="text-3xl md:text-5xl text-center">Your Boards</h1>

        <div className="my-10 ">
          <button
            className="flex items-center justify-center gap-3 md:py-2 md:rounded-lg  text-primary-foreground bg-accent  font-semibold hover:opacity-70 transition cursor-pointer py-1.5 px-5 rounded-lg text-sm"
            onClick={() => setShowAddBoard(true)}
          >
            Add a Board <IconPlus className="size-5" />
          </button>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {boards.length > 0 &&
              boards.map((board, index) => {
                const { messages = [], name, id, slug }: Board = board; // Default empty array if messages is undefined

                const boardName = inputs[index];
                return (
                  <Card className="bg-secondary-foreground p-5 md:h-[200px] cursor-pointer" key={id}>
                    <CardTitle className="text-md md:text-xl flex items-center justify-between gap-5">
                      <input
                        type="text"
                        value={boardName && boardNameTrimmer(boardName)}
                        className={twMerge("w-full text-lg outline-none px-5 py-2", editingBoardId === id && "border border-white/15")}
                        disabled={editingBoardId !== id} // Disable all other inputs except the one being edited
                        onChange={(e) => handleChange(index, e.target.value)}
                      />

                      {editingBoardId === id ? (
                        <SaveIcon className="cursor-pointer" onClick={() => onBoardNameSave(name, index, slug)} />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical className="size-5 cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 bg-secondary-foreground">
                            <DropdownMenuLabel>{boardNameTrimmer(boardName)}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => setEditingBoardId(id)}>Edit Board Name</DropdownMenuItem>
                              <DropdownMenuItem >
                                <AlertDialog>
                                  <AlertDialogTrigger onClick={() => {
                                    setShowAlertDialog(true)
                                    setDeletingBoardInfo({
                                      id,
                                      slug,
                                      name,
                                      messages
                                    })
                                  }} asChild>
                                    <div className='w-full flex  gap-3 justify-between items-center' >
                                      Delete Board
                                      <Trash2 className=' cursor-pointer' />
                                    </div>
                                  </AlertDialogTrigger>

                                </AlertDialog>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Export and Backup</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Export Messages As</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="bg-secondary-foreground">
                                    <DropdownMenuItem onClick={()=>exportFromJSON({data:messages,fileName:`${slug}-messages`,exportType:'csv'})}>CSV</DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>exportFromJSON({data:messages,fileName:`${slug}-messages`,exportType:'json'})}>JSON</DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                         
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardTitle>
                    <CardContent className="flex flex-col">
                      <div className="flex items-center gap-5 text-sm">
                        <MessageSquareIcon className='size-5'/>
                        <span className="text-white/50">{messages?.length || 0} Messages</span>
                      </div>
                    </CardContent>
                    <CardFooter><Button variant={"accent"} onClick={() => router.push(`boards/${slug}`)}>View Messages</Button></CardFooter>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>

      {showAlertDialog &&
        <AlertDialog open={showAlertDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your message
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction className='bg-accent hover:bg-accent/70' onClick={onBoardDelete} >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }


      {showAddBoard && (
        <div className="w-screen px-[4%] h-full fixed z-80 flex justify-center items-center top-0 left-0 bg-black/10 backdrop-blur-sm">
          <div className="w-full md:w-4/10 p-5 md:p-10 bg-primary rounded-xl z-90 border border-white/15 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-sm md:text-md text-white/50">Enter a name that best describes your board</h3>
              <X className="size-5 cursor-pointer" onClick={() => setShowAddBoard(false)} />
            </div>
            <Input
              className="text-white placeholder:text-white py-2.5 px-5"
              placeholder="Board Name Here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <Button
              variant={"accent"}
              className="w-1/3"
              onClick={onCreateBoard}
            >
              Create Board
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;

const BoardLoader = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col gap-5'>
      <h3 className='text-xl md:text-3xl text-white/50 text-center'>"Organizing your boards... just a moment!"</h3>
      <Loader />
    </div>
  );
};
