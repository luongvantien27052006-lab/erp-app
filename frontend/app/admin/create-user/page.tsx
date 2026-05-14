"use client";

import { useState } from "react";

export default function CreateUser() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    hometown: "",
    password: "",
    role: "sale",
  });

  const handleCreate = async () => {
    await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Tạo tài khoản thành công");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow space-y-4">

      <h2 className="font-bold text-lg">Tạo tài khoản</h2>

      <input placeholder="Họ tên"
        className="border p-3 rounded-xl w-full"
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />

      <input placeholder="SĐT"
        className="border p-3 rounded-xl w-full"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input placeholder="Email"
        className="border p-3 rounded-xl w-full"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input placeholder="Quê quán"
        className="border p-3 rounded-xl w-full"
        onChange={(e) => setForm({ ...form, hometown: e.target.value })}
      />

      <input type="password" placeholder="Mật khẩu"
        className="border p-3 rounded-xl w-full"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        className="border p-3 rounded-xl w-full"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
              <option value="admin">Admin</option>
              <option value="sale">Sale</option>
              <option value="accountant">Kế toán</option>
              <option value="profile">Hồ sơ</option>
              <option value="teacher">Giáo viên</option>
              <option value="student">Học sinh</option>
      </select>

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white p-3 rounded-xl w-full"
      >
        Tạo tài khoản
      </button>
    </div>
  );
}