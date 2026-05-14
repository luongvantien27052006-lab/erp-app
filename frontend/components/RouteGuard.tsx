"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { routePermissions } from "@/lib/permissions";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [allowed, setAllowed] =
    useState<boolean | null>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("user");

    if (!userData) {
      setAllowed(false);
      return;
    }

    const user = JSON.parse(userData);

    const allowedRoles =
      routePermissions[
        pathname as keyof typeof routePermissions
      ];

    if (!allowedRoles) {
      setAllowed(true);
      return;
    }

    setAllowed(
      allowedRoles.includes(user.role)
    );
  }, [pathname]);

  if (allowed === null) {
    return null;
  }

  if (!allowed) {
    return (
      <div className="p-10 text-red-500 font-bold">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return <>{children}</>;
}