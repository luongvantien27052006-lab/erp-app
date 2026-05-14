"use client";

import { useEffect, useState } from "react";

// ✅ thêm type cho props
type Props = {
    studentId: number;
};

// ✅ thêm type cho payment (khuyên dùng)
type Payment = {
    id: number;
    amount: number;
};

export default function PaymentPanel({ studentId }: Props) {
    const [amount, setAmount] = useState("");
    const [list, setList] = useState<Payment[]>([]);

    const token = localStorage.getItem("token");

    const load = async () => {
        const res = await fetch(`http://localhost:5000/api/payments/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setList(data);
    };

    useEffect(() => {
        load();
    }, []);

    const addPayment = async () => {
        if (!amount) return;

        await fetch("http://localhost:5000/api/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                studentId,
                amount,
            }),
        });

        setAmount("");
        load();
    };

    return (
        <div className="space-y-2">
            <input
                placeholder="Số tiền"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 rounded w-full"
            />

            <button
                onClick={addPayment}
                className="bg-green-600 text-white px-3 py-1 rounded"
            >
                Thêm thanh toán
            </button>

            <div className="text-sm space-y-1">
                {list.map((p) => (
                    <div key={p.id} className="border p-2 rounded">
                        {p.amount.toLocaleString()} VND
                    </div>
                ))}
            </div>
        </div>
    );
}