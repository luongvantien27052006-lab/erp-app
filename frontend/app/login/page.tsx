"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleLogin = async (e?: any) => {
        if (e) e.preventDefault();

        try {
            setLoading(true);

            // ✅ CHỈ 1 FETCH DUY NHẤT
            const res = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login lỗi");
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            document.cookie = `role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 100);

        } catch (err: any) {
            console.error(err);
            alert(err.message || "Không đăng nhập được");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
            >
                <h1 className="text-3xl font-bold text-center mb-8">
                    Sol Dream ERP
                </h1>

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-xl p-4 mb-4"
                    placeholder="Email"
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-xl p-4 mb-6"
                    type="password"
                    placeholder="Mật khẩu"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-xl p-4"
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </main>
    );
}