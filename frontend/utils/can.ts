import { ROLE_MAP } from "./roleMap";

export function can(user: any, permission: string) {
	if (!user?.role) return false;

	const role = user.role.toUpperCase();
	const roleData = ROLE_MAP[role];

	if (!roleData) return false;

	const perms = roleData.permissions;

	if (perms.includes("*")) return true;

	return perms.includes(permission);
}