"use client";

import { useState } from "react";

export default function CreateEmployeePage() {
  const [form, setForm] =
    useState({
      employeeId: "",
      email: "",
      fullName: "",
      address: "",
      role: "SALE",
      password: "",
    });

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async () => {
      if (
        !form.employeeId.trim() ||
        !form.email.trim() ||
        !form.fullName.trim() ||
        !form.address.trim() ||
        !form.password.trim()
      ) {
        alert(
          "Vui lòng nhập đầy đủ thông tin"
        );
        return;
      }

      try {
        setSubmitting(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/employees/create",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                employeeId:
                  form.employeeId,
                email:
                  form.email,
                fullName:
                  form.fullName,
                address:
                  form.address,
                role:
                  form.role,
                password:
                  form.password,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Tạo thất bại"
          );
        }

        alert(
          "Tạo tài khoản thành công"
        );

        window.location.replace(
          "/employees"
        );
      } catch (error: any) {
        console.error(error);

        alert(
          error.message ||
            "Tạo tài khoản thất bại"
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 space-y-5">
      <h1 className="text-3xl font-bold">
        Tạo tài khoản nhân viên
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="employeeId"
          placeholder="ID nhân viên"
          value={
            form.employeeId
          }
          onChange={
            handleChange
          }
          className="border rounded-xl p-4"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={
            handleChange
          }
          className="border rounded-xl p-4"
        />
      </div>

      <input
        name="fullName"
        placeholder="Họ và tên"
        value={
          form.fullName
        }
        onChange={
          handleChange
        }
        className="w-full border rounded-xl p-4"
      />

      <input
        name="address"
        placeholder="Địa chỉ"
        value={
          form.address
        }
        onChange={
          handleChange
        }
        className="w-full border rounded-xl p-4"
      />

      <select
        name="role"
        value={form.role}
        onChange={
          handleChange
        }
        className="w-full border rounded-xl p-4"
      >
        <option value="SALE">
          SALE
        </option>
        <option value="ACCOUNTANT">
          ACCOUNTANT
        </option>
        <option value="PROFILE">
          PROFILE
        </option>
        <option value="TEACHER">
          TEACHER
        </option>
        <option value="ADMIN">
          ADMIN
        </option>
        <option value="STUDENT">
          HỌC SINH
        </option>
      </select>

      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        value={
          form.password
        }
        onChange={
          handleChange
        }
        className="w-full border rounded-xl p-4"
      />

      <button
        onClick={
          handleSubmit
        }
        disabled={
          submitting
        }
        className="w-full bg-black text-white px-6 py-4 rounded-xl hover:opacity-90 disabled:opacity-50"
      >
        {submitting
          ? "Đang tạo..."
          : "Tạo tài khoản"}
      </button>
    </div>
  );
}