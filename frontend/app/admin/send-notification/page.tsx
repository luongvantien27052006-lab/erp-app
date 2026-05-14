"use client";

import { useState } from "react";

export default function SendNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("ACCOUNTANT");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // 🔥 CHỐT: check token kỹ
      if (!token || token === "null" || token === "undefined") {
        alert("Token không hợp lệ, vui lòng đăng nhập lại");
        return;
      }

      console.log("🔑 TOKEN GỬI:", token);

      const res = await fetch(
        "http://localhost:5000/api/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`, // 🔥 FIX CHUẨN
          },
          body: JSON.stringify({
            title,
            message,
            type: "ROLE",
            value: role,
          }),
        }
      );

      console.log("📡 STATUS:", res.status);

      // 🔥 bắt lỗi 401 rõ ràng
      if (res.status === 401) {
        alert("401 - Token sai hoặc hết hạn");
        return;
      }

      const data = await res.json();
      console.log("📦 RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Gửi thất bại");
      }

      alert("✅ Gửi thông báo thành công");
      setTitle("");
      setMessage("");
    } catch (err: any) {
      console.error("❌ ERROR:", err);
      alert(err.message || "Lỗi gửi thông báo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gửi thông báo</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề"
        className="border p-2 w-full mb-3"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nội dung"
        className="border p-2 w-full mb-3"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 mb-3"
      >
        <option value="ACCOUNTANT">Kế toán</option>
        <option value="PROFILE">Hồ sơ</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </button>
    </div>
  );
}