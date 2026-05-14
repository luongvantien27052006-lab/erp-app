"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateVisaPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    studentId: "",
    school: "",
    intake: "",
    status: "MOI_TAO"
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/visa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        studentId: parseInt(form.studentId)
      })
    });

    const data = await response.json();

    if (data.id) {
      alert("Tạo hồ sơ visa thành công");
      router.push("/visa");
    } else {
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Tạo hồ sơ visa
        </h1>

        <input
          name="studentId"
          placeholder="ID học sinh"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="school"
          placeholder="Tên trường"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          name="intake"
          placeholder="Kỳ nhập học"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <select
          name="status"
          className="w-full border p-3 rounded mb-6"
          onChange={handleChange}
        >
          <option value="MOI_TAO">Mới tạo</option>
          <option value="DA_NOP">Đã nộp hồ sơ</option>
          <option value="PHONG_VAN">Phỏng vấn</option>
          <option value="DA_DAU">Đã đậu</option>
          <option value="TRUOT">Trượt</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-3 rounded"
        >
          Lưu hồ sơ
        </button>
      </div>
    </main>
  );
}