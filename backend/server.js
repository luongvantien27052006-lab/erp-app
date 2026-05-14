require("dotenv").config();
console.log("JWT:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const app = express();

/* ================= ROUTES ================= */
const paymentRoutes = require("./routes/paymentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const contractRoutes = require("./routes/contractRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const uploadRoutes = require("./routes/upload");

/* ================= DB ================= */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});

/* ================= MIDDLEWARE ================= */

// 🔥 GIỮ NGUYÊN
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

// 🔥 FIX DUY NHẤT (SỬA DÒNG NÀY)
app.options("*", cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= API ================= */
app.use("/api/payments", paymentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

/* ================= SOCKET ================= */
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" },
});

global.io = io;

io.on("connection", (socket) => {
    console.log("🔥 connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join("USER_" + userId);
    });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server + Socket running on ${PORT}`);
});