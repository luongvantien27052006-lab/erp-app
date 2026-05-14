"use client";

import { useEffect, useState } from "react";

export default function FinanceDashboard() {
    const [summary, setSummary] = useState<any>({});
    const [list, setList] = useState<any[]>([]);
    const [warnings, setWarnings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState("");

    useEffect(() => {
        loadAll();
    }, [month]);

    const loadAll = async () => {
        try {
            setLoading(true);

            const summaryUrl = month
                ? `http://localhost:5000/api/payments/admin/summary?month=${month}`
                : `http://localhost:5000/api/payments/admin/summary`;

            // 🔥 FETCH ĐỘC LẬP (KHÔNG LÀM SẬP TOÀN TRANG)
            const [sRes, lRes, wRes] = await Promise.all([
                fetch(summaryUrl, { credentials: "include" }),
                fetch("http://localhost:5000/api/payments/admin/list", { credentials: "include" }),
                fetch("http://localhost:5000/api/payments/admin/warnings", { credentials: "include" }),
            ]);

            // 🔥 DEBUG CHÍNH XÁC
            console.log("API STATUS:", {
                summary: sRes.status,
                list: lRes.status,
                warnings: wRes.status
            });

            // 🔥 SAFE PARSE
            const summaryData = sRes.ok ? await sRes.json() : {};
            const listData = lRes.ok ? await lRes.json() : [];
            const warningData = wRes.ok ? await wRes.json() : {};

            setSummary(summaryData || {});
            setList(Array.isArray(listData) ? listData : []);
            setWarnings(warningData || {});

            setLoading(false);

        } catch (err) {
            console.error("LOAD ERROR:", err);
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const rows = list.map(p =>
            `${p.student?.fullName || ""},${p.amount},${p.createdAt}`
        );

        const csv = ["Tên,Tiền,Ngày", ...rows].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "finance.csv";
        a.click();
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="p-6 space-y-6">

            <h1 className="text-2xl font-bold">🔥 Finance Pro Max</h1>

            {/* FILTER */}
            <div className="flex gap-3">
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    onClick={exportCSV}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Export CSV
                </button>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-3 gap-4">
                <Card title="Doanh thu" value={summary.revenue} />
                <Card title="Giao dịch" value={summary.totalPayments} />
                <Card title="Cảnh báo" value={warnings?.unpaidCount} red />
            </div>

            {/* CHART */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-3">📊 Doanh thu theo tháng</h2>

                <div className="flex gap-2 items-end h-40">
                    {summary?.monthly?.map((m: any, i: number) => (
                        <div key={i} className="flex flex-col items-center">
                            <div
                                className="bg-black w-8 rounded"
                                style={{
                                    height: `${(m.total || 0) / 1000000}px`,
                                }}
                            />
                            <span className="text-xs">T{m.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* TOP SALE */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-3">🏆 Top sale</h2>

                {summary?.topSale?.length ? (
                    summary.topSale.map((s: any, i: number) => (
                        <div key={i} className="flex justify-between border-b py-2">
                            <span>{s.name}</span>
                            <span className="font-bold">
                                {(s.total || 0).toLocaleString()} đ
                            </span>
                        </div>
                    ))
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </div>

            {/* PAYMENT LIST */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-3">💰 Giao dịch</h2>

                {list.length ? (
                    list.map((p: any) => (
                        <div key={p.id} className="flex justify-between border-b py-2">
                            <span>{p.student?.fullName || "N/A"}</span>
                            <span>{(p.amount || 0).toLocaleString()} đ</span>
                        </div>
                    ))
                ) : (
                    <p>Không có giao dịch</p>
                )}
            </div>

            {/* WARNING */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-3 text-red-500">⚠️ Cảnh báo</h2>

                {warnings?.list?.length ? (
                    warnings.list.map((s: any) => (
                        <div key={s.id} className="border-b py-2">
                            {s.fullName} - Chưa thanh toán
                        </div>
                    ))
                ) : (
                    <p>Không có cảnh báo</p>
                )}
            </div>

        </div>
    );
}

/* COMPONENT CARD */
function Card({ title, value, red }: any) {
    return (
        <div className="p-4 bg-white shadow rounded">
            <p className="text-gray-500">{title}</p>
            <p className={`text-xl ${red ? "text-red-500" : ""}`}>
                {(value || 0).toLocaleString()}
            </p>
        </div>
    );
}