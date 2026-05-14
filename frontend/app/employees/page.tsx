"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type Employee = {
  id: number;
  employeeId: string;
  email: string;
  fullName: string;
  address: string;
  role: string;
};

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [authorized, setAuthorized] =
    useState(false);

  // 🔥 CHECK ROLE NGAY TỪ ĐẦU
  useEffect(() => {
    const role =
      localStorage.getItem("role");

    if (role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    setAuthorized(true);
  }, []);

  // 🔥 CHỈ FETCH KHI ADMIN
  useEffect(() => {
    if (!authorized) return;

    const fetchEmployees =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const res = await fetch(
            "http://localhost:5000/api/employees",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data =
            await res.json();

          const employeeList =
            Array.isArray(data)
              ? data
              : data.employees ||
                data.data ||
                [];

          setEmployees(employeeList);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchEmployees();
  }, [authorized]);

  const filteredEmployees =
    useMemo(() => {
      return employees.filter(
        (e) =>
          e.fullName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          e.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [employees, search]);

  // ❌ KHÔNG PHẢI ADMIN → KHÔNG RENDER GÌ
  if (!authorized) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          Quản lý nhân viên
        </h1>

        <button
          onClick={() =>
            (window.location.href =
              "/employees/create")
          }
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          + Thêm nhân viên
        </button>
      </div>

      <input
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border p-3 rounded-xl w-full"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        filteredEmployees.map((e) => (
          <div
            key={e.id}
            className="p-4 border rounded-xl"
          >
            {e.fullName} - {e.role}
          </div>
        ))
      )}
    </div>
  );
}