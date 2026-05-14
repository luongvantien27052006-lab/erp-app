"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ContractPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/students/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  const exportPDF = async () => {
    const canvas = await html2canvas(ref.current!, {
      scale: 2, // 🔥 tăng nét
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save(`hop-dong-${data.fullName}.pdf`);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">

      {/* CONTRACT */}
      <div
        ref={ref}
        className="bg-white w-[794px] p-10 shadow rounded"
        style={{ fontFamily: "Times New Roman" }}
      >
        {/* HEADER */}
        <div className="text-center">
          <p className="font-bold">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p className="italic">Độc lập - Tự do - Hạnh phúc</p>
          <div className="border-b w-40 mx-auto my-2"></div>
        </div>

        {/* TITLE */}
        <h1 className="text-center font-bold text-lg mt-4">
          HỢP ĐỒNG DU HỌC
        </h1>

        <p className="mt-4 text-justify">
          Hôm nay, chúng tôi gồm:
        </p>

        {/* BÊN A */}
        <div className="mt-3">
          <p className="font-bold">BÊN A: TRUNG TÂM DU HỌC</p>
          <p>Địa chỉ: ...</p>
          <p>Điện thoại: ...</p>
        </div>

        {/* BÊN B */}
        <div className="mt-4">
          <p className="font-bold">BÊN B: HỌC SINH</p>

          <p>Họ tên: {data.fullName}</p>
          <p>Ngày sinh: {data.dob}</p>
          <p>Giới tính: {data.gender}</p>
          <p>Địa chỉ: {data.address}</p>
          <p>CCCD: {data.cccd}</p>
          <p>Ngày cấp: {data.issueDate}</p>
        </div>

        {/* NỘI DUNG */}
        <div className="mt-4 text-justify">
          <p>
            Hai bên thống nhất ký kết hợp đồng với các điều khoản sau:
          </p>

          <p className="mt-2">
            Điều 1: Bên A có trách nhiệm hỗ trợ Bên B trong quá trình
            làm hồ sơ du học...
          </p>

          <p className="mt-2">
            Điều 2: Bên B có trách nhiệm cung cấp đầy đủ thông tin...
          </p>
        </div>

        {/* SIGN */}
        <div className="flex justify-between mt-10 text-center">
          <div>
            <p className="font-bold">ĐẠI DIỆN BÊN A</p>
            <p className="mt-16">(Ký tên)</p>
          </div>

          <div>
            <p className="font-bold">BÊN B</p>
            <p className="mt-16">{data.fullName}</p>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={exportPDF}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Xuất PDF
      </button>

    </div>
  );
}