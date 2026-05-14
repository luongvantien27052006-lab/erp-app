"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    alert("Đổi mật khẩu thành công");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Đổi mật khẩu
      </h1>

      <div className="space-y-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Mật khẩu cũ"
          value={form.oldPassword}
          onChange={handleChange}
          className="w-full border rounded-xl p-4"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Mật khẩu mới"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full border rounded-xl p-4"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded-xl p-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}