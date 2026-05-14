export const ROLES = {
  ADMIN: "ADMIN",
  SALE: "SALE",
  ACCOUNTANT: "ACCOUNTANT",
  TEACHER: "TEACHER",
  PROFILE: "PROFILE",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];