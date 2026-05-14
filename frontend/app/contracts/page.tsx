"use client";

import { useState } from "react";

export default function ContractPage() {
  const [email, setEmail] =
    useState("");

  const [studentName,
    setStudentName] =
    useState("");

  const [content,
    setContent] =
    useState(
      "Nội dung hợp đồng..."
    );

  const sendContract =
    async () => {
      await fetch(
        "http://localhost:5000/api/contracts/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            studentName,
            content,
          }),
        }
      );

      alert(
        "Đã gửi hợp đồng"
      );
    };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">
          Tạo hợp đồng
        </h1>

        <input
          placeholder="Email PHHS"
          className="border p-3 rounded-lg w-full mb-4"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          placeholder="Tên học sinh"
          className="border p-3 rounded-lg w-full mb-4"
          value={
            studentName
          }
          onChange={(e) =>
            setStudentName(
              e.target.value
            )
          }
        />

        <textarea
          className="border p-3 rounded-lg w-full h-40 mb-4"
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
        />

        <button
          onClick={
            sendContract
          }
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Gửi hợp đồng
        </button>
      </div>
    </div>
  );
}