import { ROLES } from "./roles";

export const menuConfig = {
  [ROLES.ADMIN]: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Học sinh", href: "/students" },
    { name: "Visa", href: "/visa" },
    { name: "Công nợ", href: "/payments" },
  ],

  [ROLES.SALE]: [
  { name: "Dashboard Sale", href: "/sale" },
  { name: "Học sinh", href: "/students" },
  { name: "Hoa hồng", href: "/commission" },
],

  [ROLES.ACCOUNTANT]: [
    { name: "Công nợ", href: "/payments" },
    { name: "Invoice", href: "/invoice" },
  ],

  [ROLES.TEACHER]: [
    { name: "Lớp học", href: "/classes" },
    { name: "Điểm danh", href: "/attendance" },
  ],

  [ROLES.PROFILE]: [
    { name: "Hồ sơ", href: "/visa" },
    { name: "Checklist", href: "/checklist" },
  ],
};