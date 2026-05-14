"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Icon = ({ children }: any) => (
    <span className="w-5 inline-block">{children}</span>
);

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [role, setRole] = useState<string | null>(null);
    const [openGroup, setOpenGroup] = useState<string | null>("students");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?.role) {
            return (
                <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-200" />
            );
        }

        setRole(user.role);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
        window.location.reload();
    };

    if (!role) {
        return (
            <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-200" />
        );
    }

    return (
        <aside className="fixed top-0 left-0 w-64 h-screen z-40
    bg-gradient-to-b from-[#6A1B9A] via-[#C2185B] to-[#E53935] 
    text-white p-5 flex flex-col shadow-2xl">

            {/* LOGO */}
            <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" className="w-10 h-10 bg-white rounded-lg p-1" />
                <h1 className="text-sm font-bold">Sol Dream Education</h1>
            </div>

            {/* DASHBOARD */}
            <Link href="/dashboard">
                <div className={`p-3 rounded-xl flex gap-2 items-center
          ${pathname === "/dashboard"
                        ? "bg-white text-black"
                        : "hover:bg-white/20"}`}>
                    <Icon>🏠</Icon> Dashboard
                </div>
            </Link>

            {/* HỌC SINH */}
            <div className="mt-4">

                <div
                    onClick={() =>
                        setOpenGroup(openGroup === "students" ? null : "students")
                    }
                    className="flex justify-between items-center cursor-pointer p-3 hover:bg-white/20 rounded-xl"
                >
                    <span>🎓 Học sinh</span>
                    <span>{openGroup === "students" ? "−" : "+"}</span>
                </div>

                {openGroup === "students" && (
                    <div className="ml-3 mt-2 space-y-1">

                        <Link href="/students">
                            <div className={`p-2 rounded-lg
                ${pathname === "/students"
                                    ? "bg-white text-black"
                                    : "hover:bg-white/20"}`}>
                                Danh sách học sinh
                            </div>
                        </Link>

                        {(role === "admin" || role === "sale") && (
                            <Link href="/students/create">
                                <div className="p-2 rounded-lg hover:bg-white/20">
                                    Thêm học sinh
                                </div>
                            </Link>
                        )}

                    </div>
                )}
            </div>

            {/* 🔥 ADMIN ONLY */}
            {role === "admin" && (
                <div className="mt-4">
                    <p className="text-xs text-white/70 mb-2">Admin</p>

                    <Link href="/admin/approvals">
                        <div className="p-2 rounded-lg hover:bg-white/20">
                            📄 Duyệt hồ sơ
                        </div>
                    </Link>

                    <Link href="/admin/notifications">
                        <div className="p-2 rounded-lg hover:bg-white/20">
                            🔔 Thông báo
                        </div>
                    </Link>

                    {/* ✅ THÊM TAB TẠO USER */}
                    <Link href="/admin/users">
                        <div className="p-2 rounded-lg hover:bg-white/20">
                            👤 Tạo tài khoản
                        </div>
                    </Link>

                </div>
            )}

            {/* PAYMENT (ADMIN + ACCOUNTANT ONLY) */}
            {(role === "admin" || role === "accountant") && (
                <div className="mt-4">
                    <Link href="/payments">
                        <div className={`p-2 rounded-lg hover:bg-white/20 
                ${pathname === "/payments" ? "bg-white text-black" : ""}`}>
                            💰 Thanh toán
                        </div>
                    </Link>
                </div>
            )}
            {(role === "admin" || role === "accountant") && (
                <Link href="/admin/finance">
                    <div className="p-2 rounded-lg hover:bg-white/20">
                        📊 Tài chính
                    </div>
                </Link>
            )}
            {role === "sale" && (
                <div className="mt-4">
                    <Link href="/dashboard/commission">
                        <div className={`p-2 rounded-lg hover:bg-white/20 
                ${pathname === "/dashboard/commission" ? "bg-white text-black" : ""}`}>
                            💸 Hoa hồng
                        </div>
                    </Link>
                </div>
            )}
        </aside>
    );
}