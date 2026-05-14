const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.cookies?.token;

            if (!token) {
                return res.status(401).json({
                    message: "Chưa đăng nhập",
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // gán user vào request
            req.user = decoded;

            // kiểm tra quyền nếu có truyền roles
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    message: "Không có quyền",
                });
            }

            // 🔥 QUAN TRỌNG NHẤT
            next();

        } catch (error) {
            console.error("AUTH ERROR:", error);
            return res.status(401).json({
                message: "Token không hợp lệ",
            });
        }
    };
};