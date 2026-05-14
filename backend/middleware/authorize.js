function authorize(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Chưa đăng nhập",
      });
    }

    if (
      !allowedRoles.includes(user.role)
    ) {
      return res.status(403).json({
        message: "Không có quyền truy cập",
      });
    }

    next();
  };
}

module.exports = authorize;