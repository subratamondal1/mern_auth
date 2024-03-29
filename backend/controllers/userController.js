import asyncHandler from "express-async-handler";

// @desc    Authenticate user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Authenticate User" });
});

// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Register User" });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Logout User" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Get User Profile" });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong.");
  res.status(200).json({ message: "Update User Profile" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};


