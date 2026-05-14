"use client";

import { useEffect, useState } from "react";

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        // 🔥 FIX: bỏ check token + interval
        fetchNoti();
    }, []);

    const fetchNoti = async () => {
        try {
            // 🔥 FIX: bỏ localStorage token

            const res = await fetch(
                "http://localhost:5000/api/notifications",
                {
                    credentials: "include", // ✅ dùng cookie
                }
            );

            if (!res.ok) {
                console.error("API lỗi:", res.status);
                setList([]);
                return;
            }

            const data = await res.json();

            if (Array.isArray(data)) {
                setList(data);
            } else {
                setList([]);
            }
        } catch (err) {
            console.error(err);
            setList([]);
        }
    };

    const unread = list.filter((n) => !n?.isRead).length;

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)}>
                🔔 {unread > 0 && <span>({unread})</span>}
            </button>

            {open && (
                <div className="absolute right-0 bg-white shadow p-3 w-64">
                    {list.length === 0 ? (
                        <p>Không có thông báo</p>
                    ) : (
                        list.map((n) => (
                            <div key={n.id}>
                                <b>{n.title}</b>
                                <p>{n.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}