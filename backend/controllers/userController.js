import asyncHandler from "express-async-handler";

// @desc    Authenticate user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  res.json({ message: "Success" });
});

export default authUser;
