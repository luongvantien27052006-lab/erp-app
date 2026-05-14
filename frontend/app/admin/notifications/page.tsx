"use client";

import { useState, useEffect } from "react";

const ROLE_MAP: any = {
  ADMIN: "Quản trị",
  SALE: "Tư vấn",
  ACCOUNTANT: "Kế toán",
  PROFILE: "Hồ sơ",
  TEACHER: "Giáo viên",
  STUDENT: "Học sinh",
};

export default function SendNotification() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "ALL",
    value: "",
  });

  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!["admin", "accountant", "profile"].includes(user.role)) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSend = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // 🔥 CHỐT: kiểm tra token
      if (!token || token === "null" || token === "undefined") {
        alert("Token không hợp lệ, vui lòng đăng nhập lại");
        return;
      }

      console.log("🔑 TOKEN:", token);

      const res = await fetch(
        "http://localhost:5000/api/notifications",
        {
            method: "POST",
            credentials: "include",
          headers: {
            "Content-Type": "application/json",
               // 🔥 FIX 401
          },
          body: JSON.stringify(form),
        }
      );

      console.log("📡 STATUS:", res.status);

      if (res.status === 401) {
        alert("401 - Token sai hoặc hết hạn");
        return;
      }

      const data = await res.json();
      console.log("📦 RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Gửi thất bại");
      }

      alert("✅ Đã gửi thông báo");
      setPreview(false);
      setForm({
        title: "",
        message: "",
        type: "ALL",
        value: "",
      });
    } catch (err: any) {
      console.error("❌ ERROR:", err);
      alert(err.message || "Lỗi gửi thông báo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">Gửi thông báo</h1>

      <input
        placeholder="Tiêu đề"
        className="border p-3 w-full"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="Nội dung"
        className="border p-3 w-full"
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
      />

      <select
        className="border p-3 w-full"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value, value: "" })
        }
      >
        <option value="ALL">Tất cả nhân viên</option>
        <option value="ROLE">Theo bộ phận</option>
        <option value="EMAIL_MULTI">Theo email</option>
      </select>

      {form.type === "ROLE" && (
        <select
          className="border p-3 w-full"
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        >
          <option value="">Chọn bộ phận</option>
                  {Object.entries(ROLE_MAP).map(([k, v]: [string, any]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      )}

      {form.type === "EMAIL_MULTI" && (
        <textarea
          placeholder="Nhập email cách nhau bằng dấu phẩy"
          className="border p-3 w-full"
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />
      )}

      <button
        onClick={() => setPreview(true)}
        className="bg-gray-800 text-white px-4 py-2"
      >
        Xem trước
      </button>

      {preview && (
        <div className="border p-4">
          <p className="font-bold">{form.title}</p>
          <p>{form.message}</p>

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-black text-white px-4 py-2 mt-2 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      )}
    </div>
  );
}