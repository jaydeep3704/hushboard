import { VerifyOTP } from "@/components/general/VerifyOTP"


export default async function page({params}:{params:Promise<{userId:string}>}) {
    const {userId}=await params
    return(
        <div className="h-screen flex justify-center items-center" >
            <VerifyOTP userId={userId}/>
        </div>
    )
}