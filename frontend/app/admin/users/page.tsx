"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        hometown: "",
        password: "",
        role: "sale",
    });

    /* ================= LOAD USERS ================= */
    const loadUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/users");
            const data = await res.json();

            // 🔥 FIX CHÍNH Ở ĐÂY
            const list = Array.isArray(data)
                ? data
                : data.data || data.users || [];

            setUsers(list);
            setFiltered(list);

        } catch (err) {
            console.error("LOAD USERS ERROR:", err);
            setUsers([]);
            setFiltered([]);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    /* ================= FILTER ================= */
    useEffect(() => {
        let data = [...users];

        if (search) {
            data = data.filter((u) =>
                u.fullName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter !== "all") {
            data = data.filter((u) => u.role === roleFilter);
        }

        setFiltered(data);
    }, [search, roleFilter, users]);

    /* ================= CREATE ================= */
    const handleCreate = async () => {
        await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        setOpen(false);
        loadUsers();
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:5000/api/auth/users/${id}`, {
            method: "DELETE",
        });
        loadUsers();
    };

    const getRoleColor = (role: string) => {
        if (role === "admin") return "bg-black text-white";
        if (role === "accountant") return "bg-blue-100 text-blue-600";
        return "bg-gray-200";
    };

    return (
        <div className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-xl"
                >
                    + Thêm user
                </button>
            </div>

            {/* FILTER */}
            <div className="flex gap-3">
                <input
                    placeholder="Tìm theo tên..."
                    className="border p-2 rounded-xl w-64"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border p-2 rounded-xl"
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">Tất cả</option>
                    <option value="admin">Admin</option>
                    <option value="sale">Sale</option>
                    <option value="accountant">Kế toán</option>
                    <option value="profile">Hồ sơ</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="student">Học sinh</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-3 text-left">Mã</th>
                            <th className="p-3 text-left">Họ tên</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">SĐT</th>
                            <th className="p-3 text-left">Quê quán</th>
                            <th className="p-3 text-left">Role</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">

                                {/* 🔥 GỘP CODE + ID */}
                                <td className="p-3 text-xs text-gray-500 font-mono">
                                    {u.code} (#{u.id?.toString().padStart(4, "0")})
                                </td>

                                <td className="p-3 font-medium">{u.fullName}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">{u.phone}</td>
                                <td className="p-3">{u.hometown}</td>

                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded ${getRoleColor(u.role)}`}>
                                        {u.role}
                                    </span>
                                </td>

                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Xoá
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                    <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 space-y-4">

                        <h2 className="text-lg font-semibold">Tạo tài khoản</h2>

                        <div className="space-y-2">

                            <input placeholder="Họ tên" className="border p-2 w-full rounded"
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            />

                            <input placeholder="SĐT" className="border p-2 w-full rounded"
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />

                            <input placeholder="Email" className="border p-2 w-full rounded"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />

                            <input placeholder="Quê quán" className="border p-2 w-full rounded"
                                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
                            />

                            <input type="password" placeholder="Mật khẩu"
                                className="border p-2 w-full rounded"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />

                            <select className="border p-2 w-full rounded"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="admin">Admin</option>
                                <option value="sale">Sale</option>
                                <option value="accountant">Kế toán</option>
                                <option value="profile">Hồ sơ</option>
                                <option value="teacher">Giáo viên</option>
                                <option value="student">Học sinh</option>
                            </select>

                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setOpen(false)} className="border px-3 py-1 rounded">
                                Huỷ
                            </button>
                            <button onClick={handleCreate} className="bg-black text-white px-3 py-1 rounded">
                                Tạo
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}