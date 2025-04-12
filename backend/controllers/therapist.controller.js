import Therapist from "../models/therapist.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const therapistSignup = async (req, res) => {
  try {
    const {
      id, name, age, image, specialization, experience,
      education, languages, pricePerSession, availability,
      email, password, confirmPassword
    } = req.body;

    if (
      !name || !age || !image || !specialization ||
      !experience || !education || !languages || !pricePerSession ||
      !availability || !email || !password || !confirmPassword
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const exists = await Therapist.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

     let rating = parseFloat((Math.random() * 3 + 2).toFixed(1));
    const newTherapist = await Therapist.create({
      id,name, age, image, rating, specialization, experience,
      education, languages, pricePerSession, availability,
      email, password
    });

    const token = generateTokenAndSetCookie(newTherapist._id, res);

    res.status(201).json({
      id: newTherapist.id,
      name: newTherapist.name,
      email: newTherapist.email,
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const therapistLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const therapist = await Therapist.findOne({ email });
    if (!therapist ) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookie(therapist._id, res);

    res.status(200).json({
      id: therapist.id,
      name: therapist.name,
      email: therapist.email,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const therapistLogout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({}, '-password -__v'); // exclude password & __v
    res.status(200).json({ success: true, therapists });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch therapists', error });
  }
};
