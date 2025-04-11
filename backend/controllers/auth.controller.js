import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    // console.log(req.body);
    const {
      name,
      email,
      password,
      confirmPassword,
      age,
      gender,
      dob,
      maritalStatus,
      profession
    } = req.body;

    // Check all required fields
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !age ||
      !gender ||
      !dob ||
      !maritalStatus ||
      !profession
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Save user
    const newUser = await User.create({
      name,
      email,
      password: password,
      age,
      gender,
      dob,
      maritalStatus,
      profession,
    });

    // Generate JWT token and set cookie
    const token = generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      dob: user.dob,
      maritalStatus: user.maritalStatus,
      profession: user.profession,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user || user.password !== oldPassword) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changePassword controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error in changeEmail controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};