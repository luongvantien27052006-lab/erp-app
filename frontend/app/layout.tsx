"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar"; // 🔥 IMPORT ĐÚNG
import "./globals.css";
import { useEffect } from "react";
import { autoLogout } from "@/utils/autoLogout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  //useEffect(() => {
  //  autoLogout();
 //}, []);

    const hideSidebar =
        pathname.startsWith("/login") ||
        pathname.startsWith("/auth");

  return (
    <html lang="vi">
      <body className="bg-gray-100">

        {/* SIDEBAR */}
        {!hideSidebar && <Sidebar />}

        {/* MAIN */}
        <main className={hideSidebar ? "" : "ml-64"}>

          {/* 🔥 TOPBAR THẬT */}
          {!hideSidebar && <Topbar />}

          {/* CONTENT */}
          <div className="p-6">
            {children}
          </div>

        </main>

      </body>
    </html>
  );
}