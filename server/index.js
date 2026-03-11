require("dotenv").config();
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const morgan     = require("morgan");

const connectDB             = require("./config/db");
const errorHandler          = require("./middleware/errorHandler");
const authRoutes            = require("./routes/auth");
const menuRoutes            = require("./routes/menu");
const reservationRoutes     = require("./routes/reservations");
const orderRoutes           = require("./routes/orders");

connectDB();

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`🔌 Socket disconnected: ${socket.id}`));
});

app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/auth",         authRoutes);
app.use("/api/menu",         menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders",       orderRoutes);

app.get("/api/health", (req, res) => res.json({ success: true, message: "Maison Dorée API is running 🍽️" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
});