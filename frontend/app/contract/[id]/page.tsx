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
    const canvas = await html2canvas(ref.current!);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("hop-dong.pdf");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">

      {/* CONTRACT CARD */}
      <div ref={ref} className="bg-white p-8 rounded-2xl shadow">

        <h1 className="text-center text-xl font-bold mb-6">
          HỢP ĐỒNG DU HỌC
        </h1>

        <div className="space-y-2">
          <p><b>Họ tên:</b> {data.fullName}</p>
          <p><b>Ngày sinh:</b> {data.dob}</p>
          <p><b>Giới tính:</b> {data.gender}</p>
          <p><b>Địa chỉ:</b> {data.address}</p>
          <p><b>CCCD:</b> {data.cccd}</p>
          <p><b>Ngày cấp:</b> {data.issueDate}</p>
        </div>

        <div className="mt-6">
          <p>
            Bên B (Học sinh): <b>{data.fullName}</b>
          </p>
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={exportPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full"
      >
        Xuất PDF
      </button>

    </div>
  );
}