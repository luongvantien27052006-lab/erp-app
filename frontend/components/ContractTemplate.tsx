"use client";

import React from "react";

type ContractProps = {
  student: {
    fullName?: string;
    cccd?: string;
    address?: string;
    parentName?: string;
    phone?: string;
  };
};

const ContractTemplate =
  React.forwardRef<
    HTMLDivElement,
    ContractProps
  >(({ student }, ref) => {
    const today =
      new Date().toLocaleDateString(
        "vi-VN"
      );

    return (
      <div
        ref={ref}
        className="bg-white rounded-2xl shadow p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          HỢP ĐỒNG TƯ VẤN DU HỌC
        </h2>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <p>
            <b>
              Họ tên học sinh:
            </b>{" "}
            {student.fullName}
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
            <b>
              Phụ huynh:
            </b>{" "}
            {
              student.parentName
            }
          </p>

          <p>
            <b>SĐT:</b>{" "}
            {student.phone}
          </p>

          <p>
            <b>
              Ngày tạo:
            </b>{" "}
            {today}
          </p>
        </div>
      </div>
    );
  });

export default ContractTemplate;