"use client";

import { useEffect, useMemo, useState } from "react";

type Payout = {
    id: number;
    program: string;
    amount: number;
    status: "PAID" | "UNPAID";
    paidAt?: string | null;
    createdAt: string;
    student: { fullName: string };
};

export default function PaymentPage() {
    const [data, setData] = useState<Payout[]>([]);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState<string>(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
    const [loading, setLoading] = useState(false);

    // 🔥 fetch
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    "http://localhost:5000/api/payments/payouts",
                    {
                        credentials: "include",
                    }
                );
                if (!res.ok) {
                    console.error("API lỗi:", res.status);
                    setData([]);
                    return;
                }
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 🔥 filter theo tháng + search
    const filtered = useMemo(() => {
        return data.filter((p) => {
            const d = new Date(p.createdAt);
            const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                2,
                "0"
            )}`;

            const matchMonth = m === month;

            const matchSearch =
                p.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
                p.program.toLowerCase().includes(search.toLowerCase());

            return matchMonth && matchSearch;
        });
    }, [data, search, month]);

    // 🔥 tổng tiền
    const total = filtered.reduce((s, i) => s + i.amount, 0);
    const paid = filtered
        .filter((i) => i.status === "PAID")
        .reduce((s, i) => s + i.amount, 0);
    const unpaid = total - paid;

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">💰 Thanh toán hoa hồng</h1>
            </div>

            {/* FILTER */}
            <div className="flex gap-4 flex-wrap">
                <input
                    placeholder="🔍 Tìm học sinh / chương trình"
                    className="border px-3 py-2 rounded-xl w-72"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <input
                    type="month"
                    className="border px-3 py-2 rounded-xl"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-2xl p-4">
                    <p className="text-gray-500">Tổng</p>
                    <p className="text-xl font-bold">
                        {total.toLocaleString()} đ
                    </p>
                </div>

                <div className="bg-green-50 shadow rounded-2xl p-4">
                    <p className="text-gray-500">Đã nhận</p>
                    <p className="text-xl font-bold text-green-600">
                        {paid.toLocaleString()} đ
                    </p>
                </div>

                <div className="bg-red-50 shadow rounded-2xl p-4">
                    <p className="text-gray-500">Chưa nhận</p>
                    <p className="text-xl font-bold text-red-500">
                        {unpaid.toLocaleString()} đ
                    </p>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow rounded-2xl overflow-hidden">
                <div className="max-h-[500px] overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="p-3 text-left">Học sinh</th>
                                <th className="p-3 text-left">Chương trình</th>
                                <th className="p-3 text-left">Hoa hồng</th>
                                <th className="p-3 text-left">Trạng thái</th>
                                <th className="p-3 text-left">Ngày tạo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center p-4">
                                        Đang tải...
                                    </td>
                                </tr>
                            )}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-4">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}

                            {filtered.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium">
                                        {p.student.fullName}
                                    </td>

                                    <td className="p-3">{p.program}</td>

                                    <td className="p-3 font-semibold">
                                        {p.amount.toLocaleString()} đ
                                    </td>

                                    <td className="p-3">
                                        {p.status === "PAID" ? (
                                            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
                                                Đã trả
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-500">
                                                Chưa trả
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-gray-500 text-sm">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}