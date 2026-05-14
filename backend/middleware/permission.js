const ROLE_MAP = {
    admin: ["*"],
    sale: ["student:create", "student:view_own"],
    student: ["student:self"],
};

module.exports = (permission) => {
    return (req, res, next) => {
        const role = req.user.role;
        const perms = ROLE_MAP[role] || [];

        if (perms.includes("*") || perms.includes(permission)) {
            return next();
        }

        return res.status(403).json({ message: "Forbidden" });
    };
};