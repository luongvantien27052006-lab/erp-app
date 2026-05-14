"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  approvalStatus: string;
};

type ClassItem = {
  id: number;
  className: string;
  teacherName: string;
  schedule: string;
  student: Student;
};

export default function ClassesPage() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [form, setForm] =
    useState({
      studentId: "",
      className: "",
      teacherName: "",
      schedule: "",
    });

  const fetchData =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const [studentRes, classRes] =
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
            "http://localhost:5000/api/classes",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const studentData =
        await studentRes.json();

      const classData =
        await classRes.json();

      setStudents(
        studentData.filter(
          (s: Student) =>
            s.approvalStatus ===
            "APPROVED"
        )
      );

      setClasses(
        classData
      );
    };

  useEffect(() => {
    fetchData();
  }, []);

  const createClass =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        "http://localhost:5000/api/classes",
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
            className:
              form.className,
            teacherName:
              form.teacherName,
            schedule:
              form.schedule,
          }),
        }
      );

      setForm({
        studentId: "",
        className: "",
        teacherName: "",
        schedule: "",
      });

      fetchData();
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Quản lý lớp học
      </h1>

      {/* Create */}
      <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-4 gap-4">
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
          placeholder="Tên lớp"
          value={
            form.className
          }
          onChange={(e) =>
            setForm({
              ...form,
              className:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Giáo viên"
          value={
            form.teacherName
          }
          onChange={(e) =>
            setForm({
              ...form,
              teacherName:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Lịch học"
          value={
            form.schedule
          }
          onChange={(e) =>
            setForm({
              ...form,
              schedule:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <button
          onClick={
            createClass
          }
          className="col-span-4 bg-black text-white py-3 rounded-xl"
        >
          Xếp lớp
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
                Lớp
              </th>
              <th className="p-4">
                Giáo viên
              </th>
              <th className="p-4">
                Lịch học
              </th>
            </tr>
          </thead>

          <tbody>
            {classes.map(
              (
                item
              ) => (
                <tr
                  key={
                    item.id
                  }
                  className="border-b"
                >
                  <td className="p-4">
                    {
                      item
                        .student
                        .fullName
                    }
                  </td>
                  <td className="p-4">
                    {
                      item.className
                    }
                  </td>
                  <td className="p-4">
                    {
                      item.teacherName
                    }
                  </td>
                  <td className="p-4">
                    {
                      item.schedule
                    }
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