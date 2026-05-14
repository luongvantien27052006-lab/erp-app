export const ROLE_MAP = {
    ADMIN: {
        label: "Quản trị",
        permissions: ["*"],
    },

    SALE: {
        label: "Tư vấn",
        permissions: [
            "student:create",
            "student:view_own",
        ],
    },

    ACCOUNTANT: {
        label: "Kế toán",
        permissions: [
            "payment:view",
            "payment:update",
        ],
    },

    PROFILE: {
        label: "Hồ sơ",
        permissions: [
            "document:view",
            "document:update",
        ],
    },

    TEACHER: {
        label: "Giáo viên",
        permissions: [
            "study:view",
            "study:update",
        ],
    },

    STUDENT: {
        label: "Học sinh",
        permissions: [
            "student:self",
            "payment:self",
            "study:self",
            "document:self",
        ],
    },
};