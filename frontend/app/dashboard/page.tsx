"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function Dashboard() {
    const router = useRouter();

    const [stats, setStats] = useState<any>({});
    const [monthly, setMonthly] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [pending, setPending] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(u);

        fetchData(u);

        const interval = setInterval(() => fetchData(u), 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async (u: any) => {
       

        const res = await fetch("http://localhost:5000/api/students", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error("API lỗi:", res.status);
            if (res.status === 401) {
                window.location.href = "/login"; // 🔥 redirect nếu mất auth
            }
            return;
        }
        const dataRaw = await res.json();

        if (!Array.isArray(dataRaw)) return;

        // 🔥 PHÂN QUYỀN
        let data = dataRaw;

        if (u?.role === "SALE") {
            data = data.filter((s: any) => s.saleId === u.id);
        }

        let approved = 0,
            pendingCount = 0,
            rejected = 0;

        const monthMap: any = {};
        let revenue = 0;

        data.forEach((s: any) => {
            if (s.status === "APPROVED") approved++;
            else if (s.status === "PENDING") pendingCount++;
            else if (s.status === "REJECTED") rejected++;

            // 🔥 revenue thật (nếu có payment)
            if (s.payments && s.payments.length > 0) {
                revenue += s.payments.reduce(
                    (sum: number, p: any) => sum + p.amount,
                    0
                );
            }

            const m = new Date(s.createdAt).getMonth() + 1;
            monthMap[m] = (monthMap[m] || 0) + 1;
        });

        setStats({
            total: data.length,
            approved,
            pending: pendingCount,
            rejected,
            revenue,
        });

        setMonthly(
            Object.keys(monthMap).map((m) => ({
                month: `T${m}`,
                value: monthMap[m],
            }))
        );

        setStatusData([
            { name: "Đã duyệt", value: approved },
            { name: "Chờ", value: pendingCount },
            { name: "Từ chối", value: rejected },
        ]);

        // 🔥 TASK THEO ROLE
        if (u?.role === "ADMIN") {
            setPending(data.filter((s: any) => s.status === "PENDING").slice(0, 5));
        } else if (u?.role === "ACCOUNTANT") {
            setPending(data.filter((s: any) => s.status === "PAYMENT_PENDING").slice(0, 5));
        } else {
            setPending([]);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Dashboard ({user?.role})
                </h1>
                <NotificationBell />
            </div>

            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card title="Tổng HS" value={stats.total} />
                <Card title="Đã duyệt" value={stats.approved} color="green" />
                <Card title="Chờ" value={stats.pending} color="yellow" />
                <Card
                    title="Doanh thu"
                    value={`${(stats.revenue || 0).toLocaleString()}đ`}
                />
            </div>

            {/* CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Box title="Học sinh theo tháng">
                    <ResponsiveContainer height={250}>
                        <LineChart data={monthly}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="value" stroke="#111827" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                <Box title="Trạng thái hồ sơ">
                    <ResponsiveContainer height={250}>
                        <PieChart>
                            <Pie data={statusData} dataKey="value" outerRadius={90}>
                                {statusData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={["#16a34a", "#eab308", "#dc2626"][i]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

            </div>

            {/* TASK */}
            <Box title="Công việc cần xử lý">

                {pending.length === 0 ? (
                    <p className="text-gray-500">
                        Không có công việc
                    </p>
                ) : (
                    <div className="space-y-2">
                        {pending.map((s) => (
                            <div
                                key={s.id}
                                onClick={() =>
                                    router.push(
                                        user?.role === "ADMIN"
                                            ? "/admin/approvals"
                                            : "/students"
                                    )
                                }
                                className="flex justify-between border-b py-2 cursor-pointer hover:bg-gray-50"
                            >
                                <span>{s.fullName}</span>
                                <span className="text-yellow-600">
                                    {s.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

            </Box>

        </div>
    );
}

function Card({ title, value, color }: any) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">{title}</p>
            <h2
                className={`text-xl font-bold ${color === "green"
                        ? "text-green-600"
                        : color === "yellow"
                            ? "text-yellow-600"
                            : ""
                    }`}
            >
                {value || 0}
            </h2>
        </div>
    );
}

function Box({ title, children }: any) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-3">{title}</h2>
            {children}
        </div>
    );
}