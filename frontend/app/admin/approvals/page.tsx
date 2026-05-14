"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApprovalsPage() {
    const router = useRouter();

    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
        try {
            console.log("👉 CALL STUDENTS API");

            const res = await fetch("http://localhost:5000/api/students", {
                credentials: "include",
            });

            console.log("👉 STUDENTS STATUS:", res.status);

            if (!res.ok) {
                setStudents([]);
                return;
            }

            let data = await res.json();

            if (!Array.isArray(data)) {
                console.error("❌ API không phải array:", data);
                setStudents([]);
                return;
            }

            data = data
                .filter((s: any) => s.status === "PENDING")
                .sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

            setStudents(data);

        } catch (err) {
            console.error("❌ FETCH STUDENTS ERROR:", err);
            setStudents([]);
        } finally {
            setLoading(false); // 🔥 đảm bảo không bao giờ treo
        }
    };

    /* ================= INIT ================= */
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                console.log("👉 CALL /me");

                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include",
                });

                console.log("👉 ME STATUS:", res.status);

                if (!res.ok) {
                    setLoading(false);
                    return;
                }

                const user = await res.json();

                if (!user?.role) {
                    setLoading(false);
                    return;
                }

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    setLoading(false);
                    return;
                }

                await fetchData();

            } catch (err) {
                console.error("❌ INIT ERROR:", err);
                setLoading(false);
            }
        };

        init();
    }, []);

    /* ================= ACTION ================= */
    const handleApprove = async (id: number) => {
        try {
            await fetch(
                `http://localhost:5000/api/students/approve/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );
            fetchData();
        } catch (err) {
            console.error("APPROVE ERROR:", err);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await fetch(
                `http://localhost:5000/api/students/reject/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );
            fetchData();
        } catch (err) {
            console.error("REJECT ERROR:", err);
        }
    };

    /* ================= UI ================= */
    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Duyệt hồ sơ</h1>

            {students.length === 0 ? (
                <p>Không có hồ sơ</p>
            ) : (
                students.map((s) => (
                    <div
                        key={s.id}
                        className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{s.fullName}</p>

                            <p className="text-sm text-gray-500">
                                Score: {s.score || 0}
                            </p>

                            <p
                                className={
                                    s.riskLevel === "LOW"
                                        ? "text-green-600"
                                        : s.riskLevel === "MEDIUM"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                }
                            >
                                {s.riskLevel}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleApprove(s.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Duyệt
                            </button>

                            <button
                                onClick={() => handleReject(s.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}