import express from "express";
import {
  therapistSignup,
  therapistLogin,
  therapistLogout,
  getAllTherapists,
} from "../controllers/therapist.controller.js";

const router = express.Router();

// Therapist sign-up
router.post("/therapist-signup", therapistSignup);

// Therapist login
router.post("/therapist-login", therapistLogin);

// Therapist logout
router.post("/therapist-logout", therapistLogout);

router.get("/all-therapists", getAllTherapists)
export default router;
