"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStudentPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [scanning, setScanning] = useState(false);

    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);

    const [frontImg, setFrontImg] = useState<string | null>(null);
    const [backImg, setBackImg] = useState<string | null>(null);

    const [form, setForm] = useState<any>({
        fullName: "",
        cccd: "",
        dob: "",
        gender: "",
        address: "",
        issueDate: "",

        phone: "",
        email: "",
        program: "",
        academicLevel: "",
        gapYear: "0",
        targetSchool: "",
        parentName: "",
        parentPhone: "",
        familyCondition: "",
        note: "",
    });
    const convertDate = (d: string) => {
        if (!d) return null;

        const parts = d.split("/");

        if (parts.length !== 3) return null;

        const [day, month, year] = parts;

        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    /* ===== FILE ===== */
    const handleFront = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setFrontFile(file);
        setFrontImg(URL.createObjectURL(file));
    };

    const handleBack = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setBackFile(file);
        setBackImg(URL.createObjectURL(file));
    };

    /* ===== OCR ===== */
    const handleScan = async () => {
        if (!frontFile) return alert("Chọn ảnh CCCD");

        setScanning(true);

        const fd = new FormData();
        fd.append("front", frontFile);
        if (backFile) fd.append("back", backFile);

        try {
            const res = await fetch("http://localhost:5000/api/ocr/scan-cccd", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();
            const raw = (data.raw_text || "").toLowerCase();

            /* ===== HELPER ===== */
            const clean = (t: string) =>
                (t || "").trim().replace(/\s+/g, " ");

            const onlyNumber = (t: string) =>
                (t || "").replace(/\D/g, "");

            /* ===== EXTRACT ===== */

            // NAME
            const fullName = clean(data.fullName || data.name);

            // CCCD
            let cccd = onlyNumber(data.cccd || data.id);
            if (!cccd && raw) {
                const match = raw.match(/\d{12}/);
                if (match) cccd = match[0];
            }

            // DOB
            let dob = data.dob;
            if (!dob) {
                const match = raw.match(/\d{2}\/\d{2}\/\d{4}/);
                if (match) dob = match[0];
            }

            // ISSUE DATE
            let issueDate = data.issueDate;
            if (!issueDate) {
                const dates = raw.match(/\d{2}\/\d{2}\/\d{4}/g);
                if (dates && dates.length > 1) {
                    issueDate = dates[dates.length - 1];
                }
            }

            // GENDER
            let gender = clean(data.gender);
            if (!gender) {
                if (raw.includes("nam")) gender = "Nam";
                else if (raw.includes("nữ") || raw.includes("nu")) gender = "Nữ";
            }

            // ADDRESS
            const address = clean(data.address);

            /* ===== KYC VALIDATION ===== */

            let warnings: string[] = [];
            let confidence = "HIGH";

            // CCCD check
            if (!cccd || cccd.length !== 12) {
                warnings.push("CCCD không hợp lệ");
                confidence = "LOW";
            }

            // DOB check
            const parse = (d: string) => {
                if (!d) return null;
                const [day, month, year] = d.split("/").map(Number);
                return new Date(year, month - 1, day);
            };

            const dobDate = parse(dob || "");
            const issueDateObj = parse(issueDate || "");

            if (!dobDate) {
                warnings.push("Không đọc được ngày sinh");
                confidence = "LOW";
            }

            if (dobDate && (new Date().getFullYear() - dobDate.getFullYear() < 14)) {
                warnings.push("Tuổi < 14 (bất thường)");
                confidence = "LOW";
            }

            if (issueDateObj && dobDate && issueDateObj < dobDate) {
                warnings.push("Ngày cấp sai");
                confidence = "LOW";
            }

            if (!gender) {
                warnings.push("Không xác định được giới tính");
                confidence = "MEDIUM";
            }

            /* ===== SET FORM ===== */
            setForm((prev: any) => ({
                ...prev,
                fullName,
                cccd,
                dob: dob || "",
                gender: gender || "",
                address,
                issueDate: issueDate || "",
            }));

            /* ===== LOG DEBUG ===== */
            console.log("OCR RESULT:", {
                fullName,
                cccd,
                dob,
                issueDate,
                gender,
                confidence,
                warnings,
            });

            /* ===== ALERT USER ===== */
            if (warnings.length > 0) {
                alert("⚠ OCR cảnh báo:\n" + warnings.join("\n"));
            }

        } catch (err) {
            console.error("OCR lỗi:", err);
            alert("Không quét được CCCD");
        }

        setScanning(false);
    };

   
    /* ===== SAVE ===== */
    const handleSave = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 🔥 QUAN TRỌNG
                body: JSON.stringify(form),
            });

            // 🔥 check lỗi tránh crash JSON
            if (!res.ok) {
                const text = await res.text();
                console.error("API ERROR:", text);
                alert("Tạo học sinh thất bại");
                return;
            }

            // nếu cần dùng data thì giữ, không thì có thể bỏ
            const data = await res.json();

            // chuyển trang
            window.location.href = "/students";


        } catch (err) {
            console.error("SAVE ERROR:", err);
            alert("Lỗi kết nối server");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">

            {/* HEADER STEP */}
            <div className="flex justify-between text-sm text-gray-500">
                <span className={step === 1 ? "font-bold text-blue-600" : ""}>Scan</span>
                <span className={step === 2 ? "font-bold text-blue-600" : ""}>Thông tin</span>
            </div>

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
                <div className="bg-white p-6 rounded-2xl shadow space-y-6">

                    <h2 className="font-bold text-lg">Quét CCCD</h2>

                    <div className="grid grid-cols-2 gap-4">

                        {/* FRONT */}
                        <label className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer">
                            {frontImg ? (
                                <img src={frontImg} className="h-32 mx-auto rounded-xl" />
                            ) : (
                                <div className="text-gray-500">📷 Mặt trước</div>
                            )}
                            <input hidden type="file" onChange={handleFront} />
                        </label>

                        {/* BACK */}
                        <label className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer">
                            {backImg ? (
                                <img src={backImg} className="h-32 mx-auto rounded-xl" />
                            ) : (
                                <div className="text-gray-500">📷 Mặt sau</div>
                            )}
                            <input hidden type="file" onChange={handleBack} />
                        </label>

                    </div>

                    <button
                        onClick={handleScan}
                        className="bg-purple-600 text-white py-2 rounded-xl w-full"
                    >
                        {scanning ? "Đang quét..." : "🔍 Quét CCCD"}
                    </button>

                    {/* PREVIEW */}
                    {form.fullName && (
                        <div className="bg-gray-50 border rounded-xl p-4 text-sm space-y-1">
                            <p><b>Họ tên:</b> {form.fullName}</p>
                            <p><b>CCCD:</b> {form.cccd}</p>
                            <p><b>Giới tính:</b> {form.gender}</p>
                            <p><b>Ngày sinh:</b> {form.dob}</p>
                            <p><b>Nơi thường trú:</b> {form.address }</p>
                            <p><b>Ngày cấp:</b> {form.issueDate }</p>
                            <p><b>Nơi cấp:</b> {form.IssuePlace || "Cục Cảnh sát QLHC về TTXH" }</p>
                        </div>
                    )}

                    <button
                        onClick={() => setStep(2)}
                        className="bg-blue-600 text-white py-2 rounded-xl w-full"
                    >
                        Tiếp tục
                    </button>

                </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
                <div className="bg-white p-6 rounded-2xl shadow space-y-4 relative">

                    {/* BACK */}
                    <button
                        onClick={() => setStep(1)}
                        className="absolute -top-21 left-0 z-50 bg-black text-white px-3 py-1 rounded-full shadow"
                    >
                        ← Quay lại
                    </button>

                    <input placeholder="SĐT học sinh"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <input placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <select
                        value={form.program}
                        onChange={(e) => setForm({ ...form, program: e.target.value })}
                        className="border p-3 rounded-xl w-full"
                    >
                        <option value="">Chọn chương trình</option>

                        <optgroup label="Miền Bắc">
                            <option value="D4-1 Bắc">D4-1</option>
                            <option value="D2-1 Bắc">D2-1</option>
                            <option value="D2-6 Bắc">D2-6</option>
                        </optgroup>

                        <optgroup label="Miền Nam">
                            <option value="D4-1 Nam">D4-1</option>
                            <option value="D2-1 Nam">D2-1</option>
                            <option value="D2-6 Nam">D2-6</option>
                        </optgroup>
                    </select>

                    <input placeholder="Học lực"
                        value={form.academicLevel}
                        onChange={(e) => setForm({ ...form, academicLevel: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <select
                        value={form.gapYear}
                        onChange={(e) => setForm({ ...form, gapYear: e.target.value })}
                        className="border p-3 rounded-xl w-full"
                    >
                        <option value="0">Gap Year: 0</option>
                        <option value="1">Gap Year: 1</option>
                        <option value="2">Gap Year: 2</option>
                    </select>

                    <input placeholder="Trường Hàn mục tiêu"
                        value={form.targetSchool}
                        onChange={(e) => setForm({ ...form, targetSchool: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <input placeholder="Họ tên phụ huynh / giám hộ"
                        value={form.parentName}
                        onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <input placeholder="SĐT phụ huynh"
                        value={form.parentPhone}
                        onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <input placeholder="Điều kiện gia đình"
                        value={form.familyCondition}
                        onChange={(e) => setForm({ ...form, familyCondition: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <textarea placeholder="Ghi chú"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="border p-3 rounded-xl w-full" />

                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white p-3 rounded-xl w-full"
                    >
                        Lưu học sinh
                    </button>

                </div>
            )}

        </div>
    );
}