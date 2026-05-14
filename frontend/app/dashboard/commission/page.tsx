"use client";

import { useEffect, useState } from "react";

export default function CommissionPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/payments/payouts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await res.json();
            setData(Array.isArray(json) ? json : []);

        } catch (err) {
            console.error(err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">💸 Hoa hồng của tôi</h1>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-4">Học sinh</th>
                                <th className="p-4">Chương trình</th>
                                <th className="p-4">Hoa hồng</th>
                                <th className="p-4">Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center p-6">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                data.map((p) => (
                                    <tr key={p.id} className="border-t">
                                        <td className="p-4">{p.student?.fullName}</td>
                                        <td className="p-4">{p.program}</td>
                                        <td className="p-4 text-green-600 font-semibold">
                                            {p.amount?.toLocaleString()} đ
                                        </td>
                                        <td className="p-4">
                                            {p.status === "PAID" ? (
                                                <span className="text-green-600 font-semibold">
                                                    Đã trả
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600 font-semibold">
                                                    Chưa trả
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}