const adminMiddleware = (req, res, next) => {
  try {
    // 🔥 Make sure user exists
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 🔒 Check role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();

  } catch (error) {
    console.error("Admin middleware error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminMiddleware;