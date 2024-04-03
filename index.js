const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Routers
const categoryRouter = require("./routers/category");
const productRouter = require("./routers/products");
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const cartRouter = require("./routers/cart");
const orderRouter = require("./routers/order");
const port = 3000;
dotenv.config();

app.use(cors());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Kết nối database thành công"))
  .catch((err) => console.log("Kết nối thất bại"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/category", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`Máy chủ đang lắng nghe qua HTTP trên http://localhost:${port}`)
);
