const prisma = require("../lib/prisma");
/**
 * Lấy danh sách thanh toán
 */
const getPayments = async (req, res) => {
  try {
    const payments =
      await prisma.payment.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Tạo thanh toán mới
 */
const createPayment = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      status,
      note,
    } = req.body;

    const payment =
      await prisma.payment.create({
        data: {
          studentId:
            Number(studentId),
          amount:
            Number(amount),
          status:
            status ||
            "PENDING",
          note:
            note || "",
        },
      });

    res.json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Cập nhật thanh toán
 */
const updatePayment = async (req, res) => {
  try {
    const { id } =
      req.params;

    const {
      amount,
      status,
      note,
    } = req.body;

    const payment =
      await prisma.payment.update({
        where: {
          id: Number(id),
        },
        data: {
          amount:
            Number(amount),
          status,
          note,
        },
      });

    res.json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Xóa thanh toán
 */
const deletePayment = async (req, res) => {
  try {
    const { id } =
      req.params;

    await prisma.payment.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message:
        "Xóa thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
};