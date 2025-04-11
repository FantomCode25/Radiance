import { protectAdmin } from "../middleware/protectAdmin.js";
import express from "express";
import { getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { getTotalUsers, login, logout, start, stop } from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Get All Orders (Admin Only)
router.get("/orders", protectAdmin, getOrders);

// ✅ Update Order Status
router.put("/orders/:orderId",protectAdmin, updateOrderStatus);

router.post("/login",login);

router.post("/logout",logout);

router.post("/start",protectAdmin, start);

router.post("/stop",protectAdmin, stop);

router.get("/get-total-users",getTotalUsers);

export default router;