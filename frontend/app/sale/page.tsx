"use client";

import { useEffect, useState } from "react";

export default function SalePage() {
  const [students, setStudents] =
    useState<any[]>([]);
  const [commission, setCommission] =
    useState(0);

  useEffect(() => {
    fetchSaleData();
  }, []);

  const fetchSaleData = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setStudents(
        Array.isArray(data) ? data : []
      );

      // ví dụ tạm tính hoa hồng
      setCommission(
        (Array.isArray(data)
          ? data.length
          : 0) * 500000
      );
    } catch (error) {
      console.error(error);
    }
  };

  const paidCount = students.filter(
    (s) => s.paymentStatus === "PAID"
  ).length;

  const unpaidCount =
    students.length - paidCount;

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard Sale
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Học sinh của tôi
          </p>
          <p className="text-3xl font-bold">
            {students.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Đã đóng tiền
          </p>
          <p className="text-3xl font-bold">
            {paidCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Chưa đóng
          </p>
          <p className="text-3xl font-bold">
            {unpaidCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Hoa hồng dự kiến
          </p>
          <p className="text-3xl font-bold">
            {commission.toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4">
                Họ tên
              </th>
              <th className="p-4">
                SĐT
              </th>
              <th className="p-4">
                Thanh toán
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b"
              >
                <td className="p-4">
                  {student.fullName}
                </td>

                <td className="p-4">
                  {student.phone}
                </td>

                <td className="p-4">
                  {student.paymentStatus ===
                  "PAID"
                    ? "Đã đóng"
                    : "Chưa đóng"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}