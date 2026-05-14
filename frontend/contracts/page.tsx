"use client";

import { useMemo } from "react";

interface ContractProps {
  student?: {
    fullName?: string;
    cccd?: string;
    phone?: string;
    parentName?: string;
    address?: string;
  };
}

export default function ContractTemplate({
  student = {
    fullName: "Lương Văn Tiến",
    cccd: "036206024064",
    phone: "0338316893",
    parentName: "Lương Văn A",
    address: "Nam Định",
  },
}: ContractProps) {
  const contractCode = useMemo(() => {
    return `HD-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-6)}`;
  }, []);

  const today = new Date().toLocaleDateString("vi-VN");

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-10 space-y-8">
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold">HỢP ĐỒNG TƯ VẤN DU HỌC</h1>
        <p className="text-gray-500 mt-2">Mã hợp đồng: {contractCode}</p>
        <p className="text-gray-500">Ngày tạo: {today}</p>
      </div>

      <section className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p><span className="font-semibold">Họ tên học sinh:</span> {student.fullName}</p>
          <p><span className="font-semibold">Số CCCD:</span> {student.cccd}</p>
          <p><span className="font-semibold">Số điện thoại:</span> {student.phone}</p>
        </div>
        <div>
          <p><span className="font-semibold">Phụ huynh:</span> {student.parentName}</p>
          <p><span className="font-semibold">Địa chỉ:</span> {student.address}</p>
          <p><span className="font-semibold">Trạng thái:</span> Chờ ký</p>
        </div>
      </section>

      <section className="space-y-4 leading-8 text-gray-700">
        <p>
          Bên A đồng ý sử dụng dịch vụ tư vấn du học Hàn Quốc do trung tâm cung cấp.
          Bên B cam kết hỗ trợ hồ sơ, đào tạo và xử lý visa theo lộ trình đã thống nhất.
        </p>
        <p>
          Học phí và phí dịch vụ sẽ được thanh toán theo từng đợt theo timeline xử lý hồ sơ.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-10 pt-10">
        <div className="text-center">
          <p className="font-semibold">BÊN A</p>
          <p className="text-sm text-gray-500 mt-16">(Ký và ghi rõ họ tên)</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">BÊN B</p>
          <p className="text-sm text-gray-500 mt-16">(Ký và đóng dấu)</p>
        </div>
      </div>
    </div>
  );
}
