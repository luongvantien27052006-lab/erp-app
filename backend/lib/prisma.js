require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// 🔥 tạo pool kết nối
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 🔥 adapter cho Prisma v7
const adapter = new PrismaPg(pool);

// 🔥 Prisma client chuẩn
const prisma = new PrismaClient({
    adapter,
    log: ["error"], // giúp debug nếu có lỗi
});

module.exports = prisma;