import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
export async function POST(req: NextRequest) {
    const { slug } = await req.json()
    if(!process.env.GEMINI_API_KEY){
        return NextResponse.json({error:"Api Key is missing or incorrect"},{status:400})
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `I am building an anonymous feedback platform I want to to provide 4 messages/questions or feedback the  user is probable to ask on the basis of given slug ${slug} please give this messages all in one string and seperate them with "||" 
            please give the response in this format only like 'just loved the todays session overall||great session on react 19||Whats your opinion on the management during todays event' write this using proper grammar maybe generate 2 questions and 2 feedbacks
            `,
        });
        const generatedMessages=await response.text

        return NextResponse.json({generatedMessages,message:"Messages generated sucessfully"},{status:200})
    } 
    catch (error) {
        console.log(error)
        return NextResponse.json({error:"An Error occured while trying to  generate messages"},{status:500})
    }
}