"use client";

import { useEffect, useState } from "react";
import StudentTimeline from "@/components/StudentTimeline";
import PaymentPanel from "@/components/PaymentPanel";

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(u);

        // 🔥 FIX: bỏ token + Authorization
        fetch("http://localhost:5000/api/students", {
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) {
                    console.error("API lỗi:", res.status);
                    return [];
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    setStudents([]);
                    setFiltered([]);
                    return;
                }

                if (u.role === "SALE") {
                    data = data.filter((s: any) => s.saleId === u.id);
                }

                setStudents(data);
                setFiltered(data);
            });
    }, []);

    useEffect(() => {
        let data = [...students];

        if (search) {
            data = data.filter((s) =>
                s.fullName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            data = data.filter((s) => s.status === statusFilter);
        }

        setFiltered(data);
    }, [search, statusFilter, students]);

    const updateStatus = async (id: number, status: string) => {
        // 🔥 FIX: bỏ token
        await fetch(`http://localhost:5000/api/students/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ status }),
        });

        location.reload();
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Quản lý học sinh</h1>

            <div className="flex gap-3 flex-wrap">
                <input
                    placeholder="Tìm tên học sinh..."
                    className="border px-3 py-2 rounded"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border px-3 py-2 rounded"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="VISA_GRANTED">VISA_GRANTED</option>
                    <option value="VISA_DENIED">VISA_DENIED</option>
                    <option value="ENROLLED">ENROLLED</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            {[
                                "ID", "Họ tên", "CCCD", "Ngày sinh", "Giới tính", "Địa chỉ",
                                "SĐT", "Email",
                                "Ngày nhập học dự kiến",
                                "Chương trình", "Học lực", "Gap Year", "Trường Hàn",
                                "Phụ huynh", "SĐT PH", "Gia đình", "Ghi chú",
                                "Sale ID", "Email Sale",
                                "Score", "Risk",
                                "Timeline", "Action"
                            ].map((h, i) => (
                                <th key={i} className="p-3 border whitespace-nowrap min-w-[120px]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((s) => (
                            <tr key={s.id} className="border-t hover:bg-gray-50">

                                <td className="p-3 border">{s.id}</td>
                                <td className="p-3 border font-medium">{s.fullName}</td>
                                <td className="p-3 border">{s.cccd}</td>
                                <td className="p-3 border">{s.dob}</td>
                                <td className="p-3 border">{s.gender}</td>
                                <td className="p-3 border">{s.address}</td>
                                <td className="p-3 border">{s.phone}</td>
                                <td className="p-3 border">{s.email}</td>

                                <td className="p-3 border">
                                    {s.expectedEnrollDate
                                        ? new Date(s.expectedEnrollDate).toLocaleDateString("vi-VN")
                                        : "-"}
                                </td>

                                <td className="p-3 border">{s.program}</td>
                                <td className="p-3 border">{s.academicLevel}</td>
                                <td className="p-3 border">{s.gapYear}</td>
                                <td className="p-3 border">{s.targetSchool}</td>

                                <td className="p-3 border">{s.parentName}</td>
                                <td className="p-3 border">{s.parentPhone}</td>
                                <td className="p-3 border">{s.familyCondition}</td>
                                <td className="p-3 border">{s.note}</td>

                                <td className="p-3 border">
                                    {user?.role === "ACCOUNTANT" && (
                                        <PaymentPanel studentId={s.id} />
                                    )}
                                </td>

                                <td className="p-3 border">{s.saleId}</td>
                                <td className="p-3 border">{s.saleEmail}</td>

                                <td className="p-3 border">{s.score || 0}</td>

                                <td className="p-3 border">
                                    <span className={
                                        s.riskLevel === "LOW"
                                            ? "text-green-600"
                                            : s.riskLevel === "MEDIUM"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                    }>
                                        {s.riskLevel || "LOW"}
                                    </span>
                                </td>

                                <td className="p-3 border">
                                    <StudentTimeline status={s.status} />
                                </td>

                                <td className="p-3 border space-y-1">

                                    {user?.role === "ADMIN" && (
                                        <>
                                            {s.status === "PENDING" && (
                                                <button onClick={() => updateStatus(s.id, "APPROVED")} className="bg-green-600 text-white px-2 py-1 rounded">Duyệt</button>
                                            )}

                                            {s.status === "PAID" && (
                                                <button onClick={() => updateStatus(s.id, "PREPARING")} className="bg-blue-600 text-white px-2 py-1 rounded">Xử lý</button>
                                            )}

                                            {s.status === "PREPARING" && (
                                                <button onClick={() => updateStatus(s.id, "SUBMITTED")} className="bg-purple-600 text-white px-2 py-1 rounded">Nộp visa</button>
                                            )}
                                        </>
                                    )}

                                    {user?.role === "ACCOUNTANT" && (
                                        <>
                                            {s.status === "APPROVED" && (
                                                <button onClick={() => updateStatus(s.id, "PAYMENT_PENDING")} className="bg-yellow-600 text-white px-2 py-1 rounded">Chờ tiền</button>
                                            )}

                                            {s.status === "PAYMENT_PENDING" && (
                                                <button onClick={() => updateStatus(s.id, "PAID")} className="bg-green-600 text-white px-2 py-1 rounded">Đã thu</button>
                                            )}
                                        </>
                                    )}

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}