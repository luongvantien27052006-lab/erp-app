const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const auth = require("../middleware/auth");

/* ================= SALE / ADMIN XEM HOA HỒNG ================= */
router.get("/payouts", auth(["sale", "admin"]), async (req, res) => {
    try {
        const { id, role } = req.user;

        const data = await prisma.commissionPayout.findMany({
            where: {
                // 🔥 SALE chỉ thấy của mình
                ...(role === "sale" ? { saleId: id } : {}),

                // 🔥 CHỈ học sinh đã duyệt
                student: {
                    status: "APPROVED",
                },
            },

            include: {
                student: {
                    select: {
                        fullName: true,
                        status: true,
                    },
                },
            },

            orderBy: { createdAt: "desc" },
        });

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* ================= ADMIN / ACCOUNTANT THANH TOÁN ================= */
router.post("/payouts/:id/pay", auth(["admin", "accountant"]), async (req, res) => {
    try {
        const id = Number(req.params.id);

        const updated = await prisma.commissionPayout.update({
            where: { id },
            data: {
                status: "PAID",
                paidAt: new Date(),
            },
        });

        res.json(updated);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* ================= TỔNG TIỀN ================= */
router.get("/payouts/summary", auth(["sale", "admin"]), async (req, res) => {
    try {
        const { id, role } = req.user;

        const data = await prisma.commissionPayout.findMany({
            where: {
                ...(role === "sale" ? { saleId: id } : {}),
                student: {
                    status: "APPROVED",
                },
            },
        });

        const total = data.reduce((sum, i) => sum + i.amount, 0);

        const paid = data
            .filter(i => i.status === "PAID")
            .reduce((sum, i) => sum + i.amount, 0);

        const unpaid = total - paid;

        res.json({ total, paid, unpaid });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}); router.get("/admin/summary", auth(["admin", "accountant"]), async (req, res) => {
    try {
        // 💰 doanh thu (từ Payment)
        const payments = await prisma.payment.findMany();
        const revenue = payments.reduce((s, i) => s + i.amount, 0);

        // 💸 hoa hồng (từ CommissionPayout)
        const payouts = await prisma.commissionPayout.findMany({
            include: { student: true, sale: true },
        });

        const totalCommission = payouts.reduce((s, i) => s + i.amount, 0);
        const paid = payouts.filter(i => i.status === "PAID")
            .reduce((s, i) => s + i.amount, 0);
        const unpaid = totalCommission - paid;

        // 📊 theo tháng
        const monthlyMap = {};
        payouts.forEach(p => {
            const d = new Date(p.createdAt);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

            if (!monthlyMap[key]) monthlyMap[key] = 0;
            monthlyMap[key] += p.amount;
        });

        const monthly = Object.entries(monthlyMap).map(([month, value]) => ({
            month,
            value,
        }));

        // 🏆 top sale
        const saleMap = {};
        payouts.forEach(p => {
            if (!saleMap[p.saleId]) {
                saleMap[p.saleId] = {
                    name: p.sale?.fullName || "Unknown",
                    total: 0,
                };
            }
            saleMap[p.saleId].total += p.amount;
        });

        const topSale = Object.values(saleMap)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        res.json({
            revenue,
            totalCommission,
            paid,
            unpaid,
            monthly,
            topSale,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;