module.exports = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            // 🔥 chưa đăng nhập hoặc thiếu user
            if (!user) {
                return res.status(401).json({
                    message: "Chưa đăng nhập",
                });
            }

            // 🔥 không có quyền
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: "Không có quyền",
                });
            }

            next();
        } catch (error) {
            console.error("ROLE ERROR:", error.message);

            return res.status(500).json({
                message: "Lỗi kiểm tra quyền",
            });
        }
    };
};