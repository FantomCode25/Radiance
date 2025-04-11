import mongoose from "mongoose";
import Order from "../models/order.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment-timezone";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Streaming-friendly upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

export const createOrder = async (req, res) => {
  try {
    // console.log("Uploaded file:", req.file);
    // console.log("Request body:", req.body);
    // console.log("User making request:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.body.order) {
      return res.status(400).json({ message: "Order data is missing" });
    }

    const orderData = JSON.parse(req.body.order);
    // console.log(orderData);

    if (!orderData.totalAmount || !orderData.totalNoOfPages ||
      !orderData.colorOption || !orderData.printType || !orderData.copyNumber) {
      return res.status(400).json({ message: "Missing required fields in order data" });
    }

    const filePath = `uploads/${req.file.filename}`;
    const fileName = req.file.originalname; // Storing relative path

    const newOrder = new Order({
      user: req.user._id,
      filePath,
      fileName,
      ...orderData,
    });

    const savedOrder = await newOrder.save();
    // console.log("Order saved:", savedOrder);

    // Emit the event for real-time updates
    req.io.emit("orders_update", await Order.find().populate("user", "username"));

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // console.log("Updating order:", orderId, "to", status);

    // 🛠 Check if orderId is valid
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("Invalid Order ID:", orderId);
      return res.status(400).json({ error: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    // console.log("Order updated successfully:", order);
    res.json({ message: "Order updated", order });
  } catch (error) {
    // console.error("Update order error:", error); // Log full error
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getUserOngoingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Completed" } })
      .select("createdAt estimatedTime status")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching ongoing orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingOrdersTime = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "Pending" });

    const totalEstimatedTime = pendingOrders.reduce((sum, order) => {
      return sum + order.estimatedTime;
    }, 0);

    res.json({ totalEstimatedTime });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized access" });

    // console.log("Fetching orders for user:", userId);

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    // console.log("Orders fetched:", orders);

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

export const getSlots = async (req, res) => {
  try {
    const timezone = "Asia/Kolkata"; // Change according to your location
    const now = moment().tz(timezone);
    const openingTime = moment().tz(timezone).set({ hour: 11, minute: 0, second: 0 });
    const closingTime = moment().tz(timezone).set({ hour: 20, minute: 0, second: 0 }); // 8 PM

    const slotDuration = 15; // 15-minute slots
    const timePerPage = 1 / 20;

    let slots = [];
    let slotStart = openingTime.clone();

    while (slotStart.isBefore(closingTime)) {
      let slotEnd = slotStart.clone().add(slotDuration, "minutes");

      if (!(slotStart.hour() === 14 && slotStart.minute() >= 30) && !(slotStart.hour() === 15 && slotStart.minute() < 30)) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          count: 0,
          timeCompleted: 0,
        });
      }

      slotStart = slotEnd;
    }

    const orders = await Order.find({
      requiredBefore: {
        $gte: openingTime.format("HH:mm"),
        $lt: closingTime.format("HH:mm"),
      },
    });

    orders.forEach((order) => {
      let orderTime = moment(order.requiredBefore, "HH:mm").tz(timezone);

      for (let slot of slots) {
        if (orderTime.isBetween(slot.start, slot.end, null, "[)")) {
          slot.count += 1;
          slot.timeCompleted += order.totalNoOfPages * timePerPage;
          break;
        }
      }
    });

    slots = slots.filter((slot) => moment(slot.end).tz(timezone).isAfter(now));

    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};