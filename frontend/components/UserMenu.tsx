"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  const initials =
    user?.fullName
      ?.split(" ")
      ?.slice(-2)
      ?.map((word: string) => word[0])
      ?.join("")
      ?.toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-black text-white font-bold"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border z-50">
          <div className="p-4 border-b">
            <p className="font-semibold">
              {user?.fullName || "Người dùng"}
            </p>
            <p className="text-sm text-gray-500">
              {user?.role || "USER"}
            </p>
          </div>

          <button
            className="w-full text-left p-4 hover:bg-gray-50"
            onClick={() => router.push("/dashboard")}
          >
            Hồ sơ
          </button>

          <button
            className="w-full text-left p-4 hover:bg-gray-50"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}