//require('dotenv').config();

//import { PrismaClient } from "@prisma/client";
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: 
        process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
});


const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB Connnected via Prisma");
    } catch (error) {
        console.log(`Database Connection error: ${error.message}`);
        process.exit(1);
        
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
};


module.exports = { prisma, connectDB, disconnectDB };