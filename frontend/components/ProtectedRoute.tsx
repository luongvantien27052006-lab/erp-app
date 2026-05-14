"use client";

import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  useEffect(() => {
    const role =
      localStorage.getItem("role");

    if (!role) {
      window.location.href = "/login";
      return;
    }

    if (!allowedRoles.includes(role)) {
      window.location.href = "/dashboard";
    }
  }, []);

  return <>{children}</>;
}