const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

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
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/category", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`Server is listening over HTTPs on http://localhost:${port}`)
);
