require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});

async function run() {
    const users = await prisma.user.findMany();

    console.log("Tổng user:", users.length);

    for (const user of users) {
        // 🔥 bỏ qua nếu đã hash rồi
        if (user.password.startsWith("$2b$")) {
            console.log("✔ đã hash:", user.email);
            continue;
        }

        const hashed = await bcrypt.hash(user.password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
        });

        console.log("🔥 đã hash:", user.email);
    }

    console.log("DONE");
}

run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());