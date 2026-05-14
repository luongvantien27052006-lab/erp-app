import { ROLES } from "./roles";

export const routePermissions = {
  "/dashboard": [
    ROLES.ADMIN,
  ],

  "/students": [
    ROLES.ADMIN,
    ROLES.SALE,
    ROLES.TEACHER,
  ],

  "/visa": [
    ROLES.ADMIN,
    ROLES.PROFILE,
  ],

  "/payments": [
    ROLES.ADMIN,
    ROLES.ACCOUNTANT,
  ],

  "/attendance": [
    ROLES.ADMIN,
    ROLES.TEACHER,
  ],

  "/commission": [
    ROLES.ADMIN,
    ROLES.SALE,
  ],
};