import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import {  Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface buttonProps{
    variant?:"default" | "destructive" | "outline" | "secondary" | "ghost",
    size?:"default" | "sm" | "lg" | "icon",
    text:string,
    icon?:ReactNode,
    classname?:string,
    iconFirst?:boolean,
    disabled?:boolean
}   

export function GeneralSubmitButton({variant='default',size='lg',text,icon,classname="",iconFirst=false,disabled=false}:buttonProps){
    const {pending}=useFormStatus()
    
    return(
        <Button disabled={disabled} variant={variant} size={size} type="submit" className={classname}>
           {
            pending ? (
                <div className="flex justify-center items-center gap-3">
                   <Loader2 className="animate-spin"/>
                   <span>submitting...</span> 
                </div>
            ) : 
            (
                iconFirst ? 
                (<div className="flex gap-2 items-center">
                   {icon && <div>{icon}</div>}
                   <span>{text}</span> 
                </div>
                )
                :
                (
                <div className="flex gap-2 items-center">
                   <span>{text}</span> 
                   {icon && <div>{icon}</div>}
                </div>
                )
            )
           }
        </Button>
    )
}