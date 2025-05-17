import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ board_slug: string }> }) {
  const { userId } = await auth();

  // Await params before destructuring
  const { board_slug } = await params;

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const existingBoard = await prisma.board.findFirst({
      where: {
        slug: board_slug,
        userId,
      },
    });

    if (!existingBoard) {
      return NextResponse.json({ error: "Board doesn't exist" }, { status: 400 });
    }

    // Delete the board and its associated messages
    const boardDeleted = await prisma.board.delete({
      where: {
        id: existingBoard.id,
      },
      include: {
        messages: true, // Include related messages
      },
    });

    // Cascade delete messages
    await prisma.message.deleteMany({
      where: {
        boardId: existingBoard.id,
      },
    });

    return NextResponse.json({ message: "Board and associated messages deleted successfully", boardDeleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error while deleting board" }, { status: 500 });
  }
}
