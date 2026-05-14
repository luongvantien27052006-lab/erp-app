"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function Topbar() {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [avatar, setAvatar] = useState("/avatar-default.png");

    // ✅ NEW STATE (đổi mật khẩu)
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });

    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    /* load avatar */
    useEffect(() => {
        fetch("http://localhost:5000/api/auth/me", {
            credentials: "include",
        })
            .then(res => res.json())
            .then(user => {
                if (user?.avatar) {
                    setAvatar("http://localhost:5000" + user.avatar);
                }
            })
            .catch(console.error);
    }, []);

    /* click ngoài */
    useEffect(() => {
        const handleClick = (e: any) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    /* 🔥 SOCKET REALTIME */
    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("new-notification", () => {
            setCount((prev) => prev + 1);
        });

        return () => socket.disconnect();
    }, []);

    /* upload avatar */
    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

       

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:5000/api/upload/avatar", {
            method: "POST",
            credentials: "include", // 🔥 QUAN TRỌNG NHẤT
            body: formData,
        });

        const data = await res.json();

        setAvatar("http://localhost:5000" + data.url);
    };

    /* logout */
    const handleLogout = () => {
        localStorage.clear();

        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "role=; path=/; max-age=0";

        window.location.href = "/login";
    };

    /* đổi mật khẩu */
    const handleChangePassword = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:5000/api/auth/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(passwordForm),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Đổi mật khẩu thất bại");
                return;
            }

            alert("Đổi mật khẩu thành công");
            setShowPasswordModal(false);
            setPasswordForm({ oldPassword: "", newPassword: "" });
        } catch (err) {
            console.error(err);
            alert("Lỗi hệ thống");
        }
    };

    return (
        <div className="h-14 bg-white shadow flex items-center justify-between px-6 relative z-50">

            <h1 className="font-semibold">ERP System</h1>

            <div className="flex items-center gap-6">

                {/* 🔔 NOTIFICATION */}
                <div
                    className="relative cursor-pointer"
                    onClick={() => router.push("/admin/notifications")}
                >
                    🔔
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full text-white">
                            {count}
                        </span>
                    )}
                </div>

                {/* 👤 AVATAR */}
                <div className="relative" ref={ref}>
                    <img
                        src={avatar}
                        className="w-9 h-9 rounded-full cursor-pointer border"
                        onClick={() => setOpen(!open)}
                    />

                    {open && (
                        <div className="absolute right-0 mt-2 bg-white shadow rounded-xl w-48 z-[999]">

                            <label className="block p-3 hover:bg-gray-100 cursor-pointer">
                                📷 Đổi ảnh đại diện
                                <input type="file" hidden onChange={handleUpload} />
                            </label>

                            {/* ✅ FIX: bật modal đổi mật khẩu */}
                            <div
                                onClick={() => setShowPasswordModal(true)}
                                className="p-3 hover:bg-gray-100 cursor-pointer"
                            >
                                🔒 Đổi mật khẩu
                            </div>

                            <div
                                onClick={handleLogout}
                                className="p-3 hover:bg-gray-100 cursor-pointer text-red-500"
                            >
                                🚪 Đăng xuất
                            </div>

                        </div>
                    )}
                </div>

            </div>

            {/* ✅ MODAL ĐỔI MẬT KHẨU */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
                    <div className="bg-white p-6 rounded-xl w-80 space-y-4">

                        <h2 className="font-bold text-lg">Đổi mật khẩu</h2>

                        <input
                            type="password"
                            placeholder="Mật khẩu cũ"
                            className="border p-2 w-full"
                            value={passwordForm.oldPassword}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            className="border p-2 w-full"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-3 py-1 border rounded"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleChangePassword}
                                className="px-3 py-1 bg-black text-white rounded"
                            >
                                Lưu
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}