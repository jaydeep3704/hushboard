"use client"
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { RadioItem } from "@radix-ui/react-dropdown-menu";
import { Lock, MessageCircle, PlusCircle, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";

const BoardSchema = z.object({
    title: z.string().min(1, "Board Title is required"),
    description: z.string().min(10, "Description must be atleast 10 characters long"),
    category: z.string().min(1, "Category is required"),
    mode: z.string().min(2, "Mode is required"),
    duration: z.string().optional()
})

export const categories = [
    { value: "technology", label: "Technology" },
    { value: "personal", label: "Personal" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "support", label: "Support" },
    { value: "random", label: "Random" },
];



export function CreateBoardForm() {
    const [auto, setAuto] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const form = useForm<z.infer<typeof BoardSchema>>({
        defaultValues: {
            title: '',
            description: '',
            category: '',
            mode: '',
            duration: "",
        },
        resolver: zodResolver(BoardSchema)
    })

    async function onSubmit(unsafeData: z.infer<typeof BoardSchema>) {
        const { success, data, error } = BoardSchema.safeParse(unsafeData)
        if(success){
            console.log(data)
            setOpen(false)
            form.reset()
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <Button variant="gradient" className="w-fit rounded-md ">
                    <PlusCircle/>
                    Create Board
                </Button>
            </DialogTrigger>
           <DialogContent> 
            <DialogTitle>Create New Board</DialogTitle>
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">Board Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter board title..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">Board Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter board Description..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">Category</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                        <SelectTrigger id="category" className="w-full">
                                            {field.value == "" ? "Select category" : <SelectValue placeholder="Select category" />}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value} id={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md">Board Mode</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={cn(
                                            "flex justify-center items-center gap-2 flex-col p-4 border rounded-lg cursor-pointer",
                                            field.value === "chat" && "bg-blue-200/10 border-blue-600"
                                        )}
                                        onClick={() => field.onChange("chat")}
                                    >
                                        <MessageCircle className="text-blue-600 size-8" />
                                        <h3>Group Chat</h3>
                                        <p className="text-sm text-muted-foreground text-center">
                                            Anyone can join and chat
                                        </p>
                                    </div>

                                    <div
                                        className={cn(
                                            "flex justify-center items-center gap-2 flex-col p-4 border rounded-lg cursor-pointer",
                                            field.value === "private" && "bg-purple-200/10 border-purple-600"
                                        )}
                                        onClick={() => field.onChange("private")}
                                    >
                                        <Lock className="text-purple-600 size-8" />
                                        <h3>Private</h3>
                                        <p className="text-sm text-muted-foreground text-center">
                                            Restricted access
                                        </p>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between ">
                        <Label className="text-md">Auto-deactivate board</Label>
                        <Switch checked={auto} onCheckedChange={() => {
                            if (auto == true) {
                                form.setValue("duration", "")
                            }
                            setAuto(!auto)
                        }} />
                    </div>
                    {
                        auto &&
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md">Duration</FormLabel>
                                    <FormControl >
                                        <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                            <SelectTrigger className="w-full" >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="1">1 hour</SelectItem>
                                                    <SelectItem value="3">3 hours</SelectItem>
                                                    <SelectItem value="6">6 hours</SelectItem>
                                                    <SelectItem value="12">12 hours</SelectItem>
                                                    <SelectItem value="24">24 hours</SelectItem>
                                                    <SelectItem value="168">1 Week</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    }
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" onClick={()=>setOpen(false)}>Cancel</Button>
                        <Button variant="gradient" className="rounded-lg hover:opacity-80" type="submit">
                            <PlusCircleIcon />
                            Add Board
                        </Button>
                    </div>

                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
}

