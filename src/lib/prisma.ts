import { PrismaClient } from '@prisma/client'

const prismaClientSingleTon=()=>{
    return new PrismaClient();
}

const globalForPrisma= globalThis as unknown as {prisma:PrismaClient | undefined }

 const prisma=globalForPrisma.prisma || prismaClientSingleTon();

 if(process.env.NODE_ENV !="production") globalForPrisma.prisma=prisma
 
 export default prisma