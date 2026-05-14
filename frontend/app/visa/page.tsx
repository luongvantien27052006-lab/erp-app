"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  fullName: string;
  approvalStatus: string;
};

type VisaProfile = {
  id: number;
  status: string;
  school?: string;
  intake?: string;
  interviewAt?: string;
  result?: string;
  student: Student;
};

export default function VisaPage() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [profiles, setProfiles] =
    useState<VisaProfile[]>([]);

  const [form, setForm] =
    useState({
      studentId: "",
      school: "",
      intake: "",
      status: "MOI_TAO",
    });

  const fetchData =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      const [studentRes, visaRes] =
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
            "http://localhost:5000/api/visa",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const studentData =
        await studentRes.json();

      const visaData =
        await visaRes.json();

      setStudents(
        studentData.filter(
          (s: Student) =>
            s.approvalStatus ===
            "APPROVED"
        )
      );

      setProfiles(
        visaData
      );
    };

  useEffect(() => {
    fetchData();
  }, []);

  const createVisa =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        "http://localhost:5000/api/visa",
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
            school:
              form.school,
            intake:
              form.intake,
            status:
              form.status,
          }),
        }
      );

      setForm({
        studentId: "",
        school: "",
        intake: "",
        status: "MOI_TAO",
      });

      fetchData();
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Quản lý hồ sơ visa
      </h1>

      {/* Create visa */}
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
          placeholder="Trường"
          value={
            form.school
          }
          onChange={(e) =>
            setForm({
              ...form,
              school:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Kỳ nhập học"
          value={
            form.intake
          }
          onChange={(e) =>
            setForm({
              ...form,
              intake:
                e.target
                  .value,
            })
          }
          className="border rounded-xl p-3"
        />

        <button
          onClick={
            createVisa
          }
          className="bg-black text-white rounded-xl"
        >
          Tạo hồ sơ
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4">
                Học sinh
              </th>
              <th className="p-4">
                Trường
              </th>
              <th className="p-4">
                Kỳ
              </th>
              <th className="p-4">
                Trạng thái
              </th>
              <th className="p-4">
                Kết quả
              </th>
            </tr>
          </thead>

          <tbody>
            {profiles.map(
              (
                profile
              ) => (
                <tr
                  key={
                    profile.id
                  }
                  className="border-b"
                >
                  <td className="p-4">
                    {
                      profile
                        .student
                        .fullName
                    }
                  </td>
                  <td className="p-4">
                    {
                      profile.school
                    }
                  </td>
                  <td className="p-4">
                    {
                      profile.intake
                    }
                  </td>
                  <td className="p-4">
                    {
                      profile.status
                    }
                  </td>
                  <td className="p-4">
                    {profile.result ||
                      "-"}
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