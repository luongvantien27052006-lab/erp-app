"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  cccd: string;
};

type Payment = {
  id: number;
  amount: number;
  method: string;
  paidAt: string;
  student: Student;
};

export default function PaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [form, setForm] =
    useState({
      studentId: "",
      amount: "",
      method: "Tiền mặt",
    });

  const fetchData =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const [studentRes, paymentRes] =
        await Promise.all([
          fetch(
            "http://localhost:5000/api/students",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            "http://localhost:5000/api/payments",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const studentsData =
        await studentRes.json();

      const paymentsData =
        await paymentRes.json();

      setStudents(
        studentsData.filter(
          (s: any) =>
            s.approvalStatus ===
            "APPROVED"
        )
      );

      setPayments(
        paymentsData
      );
    };

  useEffect(() => {
    fetchData();
  }, []);

  const createPayment =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId:
              Number(
                form.studentId
              ),
            amount:
              Number(
                form.amount
              ),
            method:
              form.method,
          }),
        }
      );

      setForm({
        studentId: "",
        amount: "",
        method: "Tiền mặt",
      });

      fetchData();
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Quản lý thanh toán
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-3 gap-4">
        <select
          value={
            form.studentId
          }
          onChange={(e) =>
            setForm({
              ...form,
              studentId:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        >
          <option value="">
            Chọn học sinh
          </option>

          {students.map(
            (student) => (
              <option
                key={
                  student.id
                }
                value={
                  student.id
                }
              >
                {
                  student.fullName
                }
              </option>
            )
          )}
        </select>

        <input
          type="number"
          placeholder="Số tiền"
          value={
            form.amount
          }
          onChange={(e) =>
            setForm({
              ...form,
              amount:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <button
          onClick={
            createPayment
          }
          className="bg-black text-white rounded-xl"
        >
          Tạo phiếu thu
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">
                Học sinh
              </th>
              <th className="p-4">
                Số tiền
              </th>
              <th className="p-4">
                Phương thức
              </th>
              <th className="p-4">
                Ngày
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map(
              (
                payment
              ) => (
                <tr
                  key={
                    payment.id
                  }
                  className="border-b"
                >
                  <td className="p-4">
                    {
                      payment
                        .student
                        .fullName
                    }
                  </td>
                  <td className="p-4">
                    {payment.amount.toLocaleString()}{" "}
                    đ
                  </td>
                  <td className="p-4">
                    {
                      payment.method
                    }
                  </td>
                  <td className="p-4">
                    {new Date(
                      payment.paidAt
                    ).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}