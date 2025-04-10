
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"
import app from "./app.ts";

const prisma = new PrismaClient();

dotenv.config();

const PORT = process.env.PORT || 3000;



async function startServer() {
    try {
        await prisma.$connect()
        app.listen(PORT,() =>{
            console.log("Server started on 3000");
        });
    }catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
})


