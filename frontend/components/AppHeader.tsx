"use client";

import { useEffect, useState } from "react";

export default function AppHeader() {
  const [mounted, setMounted] =
    useState(false);

  const [avatar, setAvatar] =
    useState("");

  const [showMenu, setShowMenu] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    const savedAvatar =
      localStorage.getItem(
        "avatar"
      );

    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );
    localStorage.removeItem(
      "role"
    );
    localStorage.removeItem(
      "avatar"
    );

    window.location.href =
      "/login";
  };

  return (
    <div className="flex justify-end items-center gap-4 p-4 relative">
      {/* Chat */}
      <button className="text-xl">
        💬
      </button>

      {/* Notification */}
      <button className="text-xl">
        🔔
      </button>

      {/* Avatar */}
      <button
        onClick={() =>
          setShowMenu(
            !showMenu
          )
        }
        className="rounded-full overflow-hidden border"
      >
        <img
          src={
            mounted
              ? avatar ||
                "https://placehold.co/40x40"
              : "https://placehold.co/40x40"
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {showMenu && (
        <div className="absolute top-16 right-0 bg-white shadow-lg rounded-xl w-48 p-3 space-y-2 z-50">
          <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
            Hồ sơ tài khoản
          </button>

          <button className="w-full text-left hover:bg-gray-100 p-2 rounded-lg">
            Đổi mật khẩu
          </button>

          <button
            onClick={
              handleLogout
            }
            className="w-full text-left text-red-600 hover:bg-gray-100 p-2 rounded-lg"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
