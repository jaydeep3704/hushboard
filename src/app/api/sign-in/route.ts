import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const POST = async (request: NextRequest) => {
  const { username,email, password } = await request.json();
  

  return NextResponse.json({ message: "Sign-in successful!" });
};
