"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
};

type CareLog = {
  id: number;
  student: Student;
  note: string;
  status: string;
  createdAt: string;
};

export default function StudentCarePage() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [logs, setLogs] =
    useState<CareLog[]>([]);

  const [form, setForm] =
    useState({
      studentId: "",
      note: "",
      status: "Đang học",
    });

  const fetchData =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const [studentRes, careRes] =
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
            "http://localhost:5000/api/student-care",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const studentData =
        await studentRes.json();

      const careData =
        await careRes.json();

      setStudents(
        studentData
      );

      setLogs(careData);
    };

  useEffect(() => {
    fetchData();
  }, []);

  const createLog =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        "http://localhost:5000/api/student-care",
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
            note:
              form.note,
            status:
              form.status,
          }),
        }
      );

      setForm({
        studentId: "",
        note: "",
        status: "Đang học",
      });

      fetchData();
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Chăm sóc học sinh
      </h1>

      {/* Create */}
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
          placeholder="Ghi chú chăm sóc"
          value={
            form.note
          }
          onChange={(e) =>
            setForm({
              ...form,
              note:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <select
          value={
            form.status
          }
          onChange={(e) =>
            setForm({
              ...form,
              status:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        >
          <option>
            Đang học
          </option>
          <option>
            Nghỉ học
          </option>
          <option>
            Cảnh báo
          </option>
        </select>

        <button
          onClick={
            createLog
          }
          className="col-span-3 bg-black text-white py-3 rounded-xl"
        >
          Lưu chăm sóc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">
                Học sinh
              </th>
              <th className="p-4">
                Ghi chú
              </th>
              <th className="p-4">
                Trạng thái
              </th>
              <th className="p-4">
                Ngày
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.map(
              (log) => (
                <tr
                  key={
                    log.id
                  }
                  className="border-b"
                >
                  <td className="p-4">
                    {
                      log
                        .student
                        .fullName
                    }
                  </td>
                  <td className="p-4">
                    {
                      log.note
                    }
                  </td>
                  <td className="p-4">
                    {
                      log.status
                    }
                  </td>
                  <td className="p-4">
                    {new Date(
                      log.createdAt
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