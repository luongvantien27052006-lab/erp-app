"use client";

import { useEffect, useState } from "react";

// ✅ thêm type
type Notification = {
    id: number;
    content: string;
};

export default function NotificationPage() {
    // ✅ fix ở đây
    const [data, setData] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            // ✅ đảm bảo đúng kiểu
            setData(result);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Thông báo</h1>

            {data.length === 0 ? (
                <p>Không có thông báo</p>
            ) : (
                data.map((n) => (
                    <div key={n.id} className="border-b p-2">
                        <p>{n.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}