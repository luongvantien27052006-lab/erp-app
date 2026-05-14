"use client";

import {
  useEffect,
  useState,
} from "react";

export default function MyProfilePage() {
  const [student, setStudent] =
    useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const res = await fetch(
        "http://localhost:5000/api/students/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      setStudent(data);
    };

  if (!student) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h1 className="text-3xl font-bold">
        Hồ sơ của tôi
      </h1>

      <p>
        <b>Họ tên:</b>{" "}
        {student.fullName}
      </p>

      <p>
        <b>Email:</b>{" "}
        {student.email}
      </p>

      <p>
        <b>CCCD:</b>{" "}
        {student.cccd}
      </p>

      <p>
        <b>Địa chỉ:</b>{" "}
        {student.address}
      </p>

      <p>
        <b>Tình trạng visa:</b>{" "}
        {student.visaStatus}
      </p>
    </div>
  );
}