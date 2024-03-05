import asyncHandler from "express-async-handler";

// @desc    Authenticate user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    res.status(401);
    throw new Error("Something went wrong.");
    res.status(200).json({ message: "Success" });
});

export default authUser;
